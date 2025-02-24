import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop ",
  description: "Buy Pharmacy Products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
