"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { UserAvatar } from "@/components/ui/user-avatar"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/#pricing" },
  { label: "How It Works", href: "/#how-it-works" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // BetterAuth keeps the session in a cookie, so this hook restores the
  // logged-in user after every page reload.
  const { data: session, isPending } = authClient.useSession()

  function isNavLinkActive(href: string) {
    if (href.startsWith("/#")) {
      return pathname === "/" && selectedAnchor === href
    }

    if (href === "/") {
      return pathname === "/" && selectedAnchor === null
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  function handleNavClick(href: string) {
    setIsOpen(false)
    setSelectedAnchor(href.startsWith("/#") ? href : null)
  }

  async function handleSignOut() {
    const { error } = await authClient.signOut()

    if (error) {
      toast.error(error.message ?? "Could not sign out. Please try again.")
      return
    }

    setIsOpen(false)
    toast.success("Signed out")
    router.refresh()
  }

  const authButtons = (
    <>
      <Link
        href="/sign-in"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-9 rounded-lg border-ink/20 bg-white px-4 text-[13px] text-ink hover:bg-cream-soft"
        )}
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className={cn(
          buttonVariants(),
          "h-9 rounded-lg bg-coral px-4 text-[13px] text-white hover:bg-coral-dark"
        )}
      >
        Sign Up
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-sky-line bg-white/95 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Logo onClick={() => setSelectedAnchor(null)} />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              aria-current={
                isNavLinkActive(link.href)
                  ? link.href.startsWith("/#")
                    ? "location"
                    : "page"
                  : undefined
              }
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isNavLinkActive(link.href)
                  ? "bg-cream-soft text-forest"
                  : "text-ink/70 hover:bg-cream-soft/70 hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2">
          {/* Auth actions: hidden on very small screens, shown in the mobile menu instead */}
          {isPending ? (
            <div className="hidden h-9 w-[172px] sm:block" aria-hidden />
          ) : session ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/dashboard"
                onClick={() => setSelectedAnchor(null)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-9 rounded-lg border-ink/20 bg-white px-4 text-[13px] text-ink hover:bg-cream-soft"
                )}
              >
                Dashboard
              </Link>
              <UserAvatar
                name={session.user.name}
                image={session.user.image ?? null}
                size="md"
              />
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-ink md:inline">
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-9 rounded-lg border-ink/20 bg-white px-4 text-[13px] text-ink hover:bg-cream-soft"
                )}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              {authButtons}
            </div>
          )}

          <ThemeToggle />

          {!isPending && session ? (
            <Link
              href="/dashboard"
              onClick={() => setSelectedAnchor(null)}
              aria-label="Open dashboard"
              className="grid size-9 place-items-center rounded-full transition-transform hover:scale-105 sm:hidden"
            >
              <UserAvatar
                name={session.user.name}
                image={session.user.image ?? null}
                size="sm"
              />
            </Link>
          ) : null}

          {/* Menu button for tablet + mobile */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:bg-cream-soft lg:hidden"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-sky-line/60 bg-white lg:hidden"
        >
          <nav
            className="page-container flex flex-col py-3"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                aria-current={
                  isNavLinkActive(link.href)
                    ? link.href.startsWith("/#")
                      ? "location"
                      : "page"
                    : undefined
                }
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isNavLinkActive(link.href)
                    ? "bg-cream-soft text-forest"
                    : "text-ink/70 hover:bg-cream-soft hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="page-container pb-4">
            {session ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <UserAvatar
                    name={session.user.name}
                    image={session.user.image ?? null}
                    size="md"
                  />
                  <p className="min-w-0 text-xs text-ink-soft">
                    Signed in as{" "}
                    <span className="font-semibold text-ink">
                      {session.user.name}
                    </span>
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => {
                    setIsOpen(false)
                    setSelectedAnchor(null)
                  }}
                  className={cn(
                    buttonVariants(),
                    "h-10 rounded-lg bg-forest text-white hover:bg-forest-active"
                  )}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 rounded-lg"
                  )}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-10 rounded-lg"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants(),
                    "h-10 rounded-lg bg-coral text-white hover:bg-coral-dark"
                  )}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
