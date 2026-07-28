import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  firstName: string;
  invoiceId: string;
  amountDue: number;
}

export const InvoiceEmail = ({
  firstName = "Client",
  invoiceId = "INV-000",
  amountDue = 0,
}: InvoiceEmailProps) => {
  const formattedAmount =
    "$" +
    (amountDue / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <Html>
      <Head />
      <Preview>Your Invoice from Wicked is ready.</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans text-black px-2">
          <Container className="border border-solid border-gray-200 p-10 my-[40px] mx-auto max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0 uppercase tracking-widest">
              WICKED
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Dear {firstName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thank you for your recent order with Wicked.
              Atelier.
            </Text>
            <Section className="bg-gray-50 p-6 my-6 text-center border border-gray-200">
              <Text className="text-gray-500 text-[10px] uppercase tracking-widest m-0 mb-2">
                Invoice
              </Text>
              <Text className="text-black text-[20px] font-bold m-0">
                {invoiceId}
              </Text>
              <Text className="text-black text-[24px] font-light m-0 mt-4">
                {formattedAmount}
              </Text>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Your official invoice has been generated and is attached to this
              email. Please review the details of your commission.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              If you have any questions regarding these specifications or
              require adjustments prior to final payment, please reply directly
              to this email.
            </Text>
            <Text className="text-gray-400 text-[12px] leading-[24px] mt-[40px]">
              — The Wicked Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default InvoiceEmail;
