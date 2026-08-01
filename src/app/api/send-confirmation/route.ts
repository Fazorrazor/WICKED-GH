import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, orderId, firstName, totalCents } = await request.json();

    if (!email || !orderId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "Wicked <onboarding@resend.dev>",
      to: [email],
      subject: "Order Confirmation - Wicked",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #050505; color: #ffffff; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
          <h1 style="font-size: 24px; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 40px; text-align: center;">WICKED</h1>
          <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">Dear ${firstName || 'Client'},</p>
          <p style="color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 30px;">
            We have received your inquiry. Our atelier is currently reviewing your request for the selected garments.
          </p>
          <div style="border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 20px 0; margin-bottom: 30px;">
            <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.1em;">Reference ID</p>
            <p style="margin: 5px 0 0 0; font-family: monospace;">${orderId}</p>
          </div>
          <p style="color: rgba(255,255,255,0.8); line-height: 1.6; margin-bottom: 40px;">
            A representative will contact you shortly regarding sizing confirmation and payment details.
          </p>
          <p style="color: rgba(255,255,255,0.5); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; text-align: center;">
            The Vault &mdash; Atelier
          </p>
        </div>
      `,
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
