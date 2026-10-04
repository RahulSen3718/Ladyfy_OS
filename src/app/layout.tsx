import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leadyfy OS | Internal Agency Management & Operations SaaS",
  description:
    "Unified operations platform for UGC & Digital Marketing Agencies. End-to-end management for clients, scripts, creators, shoots, video production pipelines, and financials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0D0D0D] text-neutral-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200`}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#171717",
              border: "1px solid #262626",
              color: "#F5F5F5",
            },
          }}
        />
      </body>
    </html>
  );
}
