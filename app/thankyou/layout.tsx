import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanky You ",
  description: "Order Summery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
