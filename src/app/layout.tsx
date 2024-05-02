// Written by Grp B
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nott-A-Problem",
  description: "A novel app to automate your problem reporting system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCb6kHJY7_rFO5uA4y5hoooKSDiuYZrhM0&libraries=places"></script>
      </head>
      <body className={inter.className} style={{ backgroundColor: "white" }}>
        {children}
      </body>
    </html>
  );
}
