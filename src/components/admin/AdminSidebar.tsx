"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  ImageIcon,
  Users,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onExitAdmin: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "books", label: "Books", icon: BookOpen },
  { id: "banners", label: "Banners", icon: ImageIcon },
  { id: "users", label: "Users", icon: Users },
  { id: "wishlists", label: "Wishlists", icon: Heart },
];

export function AdminSidebar({
  activeSection,
  onSectionChange,
  onExitAdmin,
}: AdminSidebarProps) {
  return (
    <aside className="w-64 h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg">
            <Image
              src="/images/logo.png"
              alt="Purple Skull Comics Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Purple Skull Comics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start border-border"
          onClick={onExitAdmin}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit Admin Mode
        </Button>
      </div>
    </aside>
  );
}
