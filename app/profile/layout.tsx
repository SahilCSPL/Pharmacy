import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "My Profile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
