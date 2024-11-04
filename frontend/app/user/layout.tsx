"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Retiro de dinero", href: "/user/with-draw" },
    { name: "Transacciones", href: "/user/transations" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white py-4 px-8 shadow-md">
        <nav className="flex space-x-4 justify-end">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium",
                pathname === item.href ? "text-yellow-400" : "text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
};

export default UserLayout;
