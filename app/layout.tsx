import { Blinker } from "next/font/google";
import "./globals.css";

const inter = Blinker({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
