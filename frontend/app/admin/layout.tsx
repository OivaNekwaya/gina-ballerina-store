// frontend/app/admin/layout.tsx
import type { Metadata } from "next";
import AdminHeader from "@/components/AdminHeader";

export const metadata: Metadata = {
  title: "Admin Panel – Gina Ballerina",
  description: "Manage products, orders, and downloads",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink/5 to-purple/5">
      <AdminHeader />
      <main className="py-8">{children}</main>
    </div>
  );
}