"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Logo } from "@/components/layout/logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/95 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions: hidden on very small screens, shown in the mobile menu instead */}
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 rounded-full px-4 text-sm text-ink hover:bg-ink/5"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants(),
              "h-10 rounded-full bg-coral px-5 text-sm text-white hover:bg-coral-dark"
            )}
          >
            Sign Up
          </Link>
        </div>

        {/* Menu button for tablet + mobile */}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-cream text-ink transition-colors hover:bg-cream-soft lg:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-line bg-cream lg:hidden"
        >
          <nav
            className="page-container flex flex-col py-3"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-cream-soft hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="page-container grid grid-cols-2 gap-2 pb-4 sm:hidden">
            <Link
              href="/sign-in"
              onClick={() => setIsOpen(false)}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 rounded-full"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setIsOpen(false)}
              className={cn(
                buttonVariants(),
                "h-10 rounded-full bg-coral text-white hover:bg-coral-dark"
              )}
            >
              Sign Up
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
