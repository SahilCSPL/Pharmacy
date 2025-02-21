import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us ",
  description: "Contact us page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
