"use client"

import type React from "react"

import { useState } from "react"
import {
  LayoutDashboard,
  Compass,
  Download,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronRight,
  CircleDot,
  SquareStack,
  Ban,
  CheckCircle2,
} from "lucide-react"

interface NavItem {
  label: string
  icon: React.ReactNode
  href?: string
  children?: { label: string; icon: React.ReactNode; href: string }[]
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/" },
  { label: "Nexus", icon: <Compass className="h-5 w-5" />, href: "/nexus" },
  { label: "Intake", icon: <Download className="h-5 w-5" />, href: "/intake" },
  {
    label: "Services",
    icon: <Briefcase className="h-5 w-5" />,
    children: [
      { label: "Pre-active", icon: <CircleDot className="h-4 w-4" />, href: "/services/pre-active" },
      { label: "Active", icon: <SquareStack className="h-4 w-4" />, href: "/services/active" },
      { label: "Blocked", icon: <Ban className="h-4 w-4" />, href: "/services/blocked" },
      { label: "Closed", icon: <CheckCircle2 className="h-4 w-4" />, href: "/services/closed" },
    ],
  },
  {
    label: "Invoices",
    icon: <FileText className="h-5 w-5" />,
    children: [
      { label: "Proforma Invoices", icon: <FileText className="h-4 w-4" />, href: "/invoices/proforma" },
      { label: "Final Invoices", icon: <FileText className="h-4 w-4" />, href: "/invoices/final" },
    ],
  },
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Services", "Invoices"])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  return (
    <aside className="w-52 bg-background border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">7</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Vault</span>
            <span className="text-xs text-muted-foreground">Anurag Yadav</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {item.icon}
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {expandedItems.includes(item.label) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedItems.includes(item.label) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {child.icon}
                        <span>{child.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </a>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
