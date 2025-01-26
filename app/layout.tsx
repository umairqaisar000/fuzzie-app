import { BillingProvider } from "@/providers/billing-provider";
import ModalProvider from "@/providers/model-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import {
  ClerkProvider
} from '@clerk/nextjs';
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fuzzie.",
  description: "Automate Your Work With Fuzzie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <BillingProvider>
              <ModalProvider>{children}
                <Toaster />
              </ModalProvider>
            </BillingProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
