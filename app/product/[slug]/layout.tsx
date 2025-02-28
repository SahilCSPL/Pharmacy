import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product",
  description: "Product Details",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
