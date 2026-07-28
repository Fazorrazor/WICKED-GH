import type { Metadata } from "next";

import { Montserrat, Bodoni_Moda } from "next/font/google";
import "@/app/globals.css";
import ScrollRestoration from "@/components/ScrollRestoration";
import { TransitionProvider } from "@/components/TransitionProvider";
import CartSidebar from "@/components/CartSidebar";
import GlobalLoader from "@/components/GlobalLoader";
import GlobalHeader from "@/components/GlobalHeader";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

const sansFont = Montserrat({
  variable: "--font-inter", // keeping variable name for css compatibility
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const displayFont = Bodoni_Moda({
  variable: "--font-space-grotesk", // keeping variable name for css compatibility
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wicked",
  description: "The Night Luxe Collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${displayFont.variable} min-h-screen bg-[#FDFDFD] antialiased`}
    >
      <body className="min-h-screen w-full flex flex-col selection:bg-[#781625] selection:text-white">
        {/*
          THIRD-PARTY SCRIPTS:
          Always use next/script with strategy="afterInteractive" or "lazyOnload" 
          for external trackers (e.g., Google Analytics, Meta Pixel) to prevent 
          them from blocking the critical rendering path.
        */}
        {/* <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script> */}

        <ScrollRestoration />
        <GlobalLoader />
        <TransitionProvider>
          <GlobalHeader />
          <Sidebar />
          {children}
          <CartSidebar />
        </TransitionProvider>

        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "font-sans text-[0.65rem] font-bold tracking-[0.1em] uppercase border border-black/10 bg-white text-[#121212] rounded-none shadow-2xl",
            style: { borderRadius: "0px" },
          }}
        />
      </body>
    </html>
  );
}
