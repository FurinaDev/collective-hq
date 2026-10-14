import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collective HQ - Operasyonel Yönetim & AI Asistanı",
  description: "Startuplar, Topluluklar, STK'lar ve Şirketler İçin Akıllı Operasyon ve E-Posta Kokpiti",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
