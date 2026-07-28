import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/components/store-management/InvoiceDocument";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Verify auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Fetch inquiry
  const { data: inquiry, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !inquiry) {
    return new NextResponse("Inquiry not found", { status: 404 });
  }

  try {
    const stream = await renderToStream(InvoiceDocument({ inquiry }));

    // Set headers for PDF download
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="INV-${inquiry.id.split("-")[0].toUpperCase()}.pdf"`,
    );

    // Convert Node stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(webStream, { headers });
  } catch (err) {
    console.error("PDF generation error:", err);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
