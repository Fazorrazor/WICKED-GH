"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { withObservability } from "@/lib/ops/server-action";
import { Resend } from "resend";
import { InvoiceEmail } from "@/components/emails/InvoiceEmail";
import { generatePdfBuffer } from "@/lib/store-management/pdf";

async function _updateInquiryStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }

  // Revalidate both the specific dossier and the main list
  revalidatePath(`/store-management/commissions/${id}`);
  revalidatePath(`/store-management`);
}

export const updateInquiryStatus = withObservability(
  "updateInquiryStatus",
  _updateInquiryStatus,
);

async function _deleteCommissionAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized: Atelier authentication required to perform destructive actions.",
    );
  }

  // Use service role to bypass RLS for administrative deletion
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SECRET_KEY;
  if (!adminUrl || !adminKey) {
    throw new Error("Missing Supabase admin credentials. Ensure SUPABASE_SECRET_KEY is set.");
  }
  const adminSupabase = createAdminClient(adminUrl, adminKey);

  const { error } = await adminSupabase.from("orders").delete().eq("id", id);

  if (error) {
    throw new Error(`Database delete failed: ${error.message}`);
  }

  // Revalidate the main list and clientele views
  revalidatePath(`/store-management`);
  revalidatePath(`/store-management/clientele`);
}

export const deleteCommissionAction = withObservability(
  "deleteCommissionAction",
  _deleteCommissionAction,
);

async function _generateAndEmailInvoiceAction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Fetch inquiry
  const { data: inquiry, error: inquiryError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (inquiryError || !inquiry) {
    throw new Error("Inquiry not found");
  }

  if (!inquiry.email) {
    throw new Error("Cannot send invoice: Inquiry has no associated email address.");
  }

  // Generate PDF
  const pdfBuffer = await generatePdfBuffer(inquiry);
  const invoiceId = `INV-${inquiry.id.split("-")[0].toUpperCase()}`;

  // Send Email if Resend key exists
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "Wicked <atelier@wicked-gh.com>",
      to: [inquiry.email],
      subject: `Your Wicked Invoice is Ready: ${invoiceId}`,
      react: InvoiceEmail({
        firstName: inquiry.email?.split("@")[0] || "Client",
        invoiceId: invoiceId,
        amountDue: inquiry.total_cents,
      }),
      attachments: [
        {
          filename: `${invoiceId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  } else {
    console.warn(
      "RESEND_API_KEY is not set. Email was not sent, but PDF was generated.",
    );
  }

  // Update Status
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SECRET_KEY;
  if (!adminUrl || !adminKey) {
    throw new Error("Missing Supabase admin credentials. Ensure SUPABASE_SECRET_KEY is set.");
  }
  const adminSupabase = createAdminClient(adminUrl, adminKey);

  await adminSupabase
    .from("orders")
    .update({ status: "invoiced" })
    .eq("id", id);

  revalidatePath(`/store-management/commissions/${id}`);
  revalidatePath(`/store-management`);
}

export const generateAndEmailInvoiceAction = withObservability(
  "generateAndEmailInvoiceAction",
  _generateAndEmailInvoiceAction,
);
