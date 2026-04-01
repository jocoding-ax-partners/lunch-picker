import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "점심 뭐먹지?",
  description: "오늘 점심 메뉴를 골라드립니다",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="text-white antialiased">{children}</body>
    </html>
  );
}
