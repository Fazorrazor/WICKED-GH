import { renderToStream } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/components/store-management/InvoiceDocument";
import React from "react";

export async function generatePdfBuffer(inquiry: any): Promise<Buffer> {
  const stream = await renderToStream(<InvoiceDocument inquiry={inquiry} />);

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
