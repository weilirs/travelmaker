import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LocationProvider } from "@/utils/locationContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full min-h-screen">
      <LocationProvider>
        <body className={`${inter.className} bg-[#faedcd] h-full`}>
          {children}
        </body>
      </LocationProvider>
    </html>
  );
}
