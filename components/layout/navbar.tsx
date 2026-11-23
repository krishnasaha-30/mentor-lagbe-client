"use client"

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
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
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const profileRef = useRef<HTMLDivElement>(null)

  // BetterAuth keeps the session in a cookie, so this hook restores the
  // logged-in user after every page reload.
  const { data: session, isPending } = authClient.useSession()

  // Close the profile menu on outside click and on Escape.
  useEffect(() => {
    if (!isProfileOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsProfileOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isProfileOpen])

  // The logo returns home, so both menus should close with it.
  function handleLogoClick() {
    setSelectedAnchor(null)
    setIsProfileOpen(false)
    setIsOpen(false)
  }

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
    setIsProfileOpen(false)
    toast.success("Signed out")
    router.refresh()
  }

  const authButtons = (
    <>
      <Link
        href="/sign-in"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-9 rounded-full border-ink/15 bg-white px-4 text-[13px] text-ink hover:bg-cream-soft"
        )}
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className={cn(
          buttonVariants(),
          "h-9 rounded-full bg-coral px-4 text-[13px] text-white hover:bg-coral-dark"
        )}
      >
        Sign Up
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 pb-2 sm:px-5 sm:pt-4 sm:pb-3">
      <div className="relative mx-auto w-full max-w-[1200px]">
        <div className="flex h-14 items-center justify-between gap-2 rounded-full border border-black/[0.06] bg-white/95 pr-2 pl-4 shadow-[0_14px_34px_-20px_rgba(20,35,29,0.45)] backdrop-blur sm:h-16 sm:gap-4 sm:pr-3 sm:pl-6 lg:grid lg:grid-cols-[auto_1fr_auto]">
          <Logo onClick={handleLogoClick} />

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex lg:justify-self-start lg:pl-4"
            aria-label="Main"
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
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isNavLinkActive(link.href)
                    ? "bg-forest px-5 text-white"
                    : "text-ink/75 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1.5 sm:gap-3">
            {/* Auth actions: hidden on very small screens, shown in the mobile menu instead */}
            {isPending ? (
              <div
                className="hidden h-9 w-[130px] sm:block"
                aria-hidden
              />
            ) : session ? (
              <div className="hidden items-center gap-3 sm:flex">
                <div ref={profileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((open) => !open)}
                    aria-expanded={isProfileOpen}
                    aria-haspopup="menu"
                    aria-label="Account menu"
                    className={cn(
                      "flex items-center gap-1 rounded-full p-1 pr-1.5 transition-colors hover:bg-cream-soft",
                      isProfileOpen && "bg-cream-soft"
                    )}
                  >
                    <UserAvatar
                      name={session.user.name}
                      image={session.user.image ?? null}
                      size="md"
                      className="ring-2 ring-forest/10"
                    />
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 text-ink/60 transition-transform duration-200",
                        isProfileOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isProfileOpen ? (
                    <div
                      role="menu"
                      aria-label="Account"
                      className="absolute top-[calc(100%+1.25rem)] right-[-3rem] w-[17rem] overflow-hidden rounded-[18px] border border-black/[0.06] bg-white p-2 shadow-[0_24px_50px_-20px_rgba(20,35,29,0.45)]"
                    >
                      <div className="px-3 pt-1.5 pb-3">
                        <p className="truncate text-sm font-semibold text-ink">
                          {session.user.name}
                        </p>
                        <span className="mt-1.5 inline-flex rounded-full bg-stat-butter px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-ink uppercase">
                          {session.user.role}
                        </span>
                      </div>

                      <div className="border-t border-line/80">
                        <Link
                          href="/dashboard"
                          role="menuitem"
                          onClick={() => {
                            setIsProfileOpen(false)
                            setSelectedAnchor(null)
                          }}
                          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream-soft"
                        >
                          <LayoutDashboard
                            aria-hidden="true"
                            className="size-4 text-ink/60"
                          />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          role="menuitem"
                          onClick={() => {
                            setIsProfileOpen(false)
                            setSelectedAnchor(null)
                          }}
                          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream-soft"
                        >
                          <UserRound
                            aria-hidden="true"
                            className="size-4 text-ink/60"
                          />
                          Update Profile
                        </Link>
                      </div>

                      <div className="border-t border-line/80 pt-2">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-coral-dark transition-colors hover:bg-coral/10"
                        >
                          <LogOut aria-hidden="true" className="size-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                {authButtons}
              </div>
            )}

            <ThemeToggle className="size-9 rounded-full border-ink/10 sm:size-10" />

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
              className="inline-flex size-9 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:bg-cream-soft sm:size-10 lg:hidden"
            >
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu: a floating card under the pill */}
        {isOpen ? (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-[22px] border border-black/[0.06] bg-white p-3 shadow-[0_24px_50px_-20px_rgba(20,35,29,0.45)] lg:hidden"
          >
            <nav
              className="flex flex-col gap-0.5"
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
                    "rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                    isNavLinkActive(link.href)
                      ? "bg-forest text-white"
                      : "text-ink/75 hover:bg-cream-soft hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 border-t border-line/80 pt-3">
              {session ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <UserAvatar
                      name={session.user.name}
                      image={session.user.image ?? null}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {session.user.name}
                      </p>
                      <span className="mt-1 inline-flex rounded-full bg-stat-butter px-2 py-0.5 text-[10px] font-bold tracking-wide text-ink uppercase">
                        {session.user.role}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      setIsOpen(false)
                      setSelectedAnchor(null)
                    }}
                    className={cn(
                      buttonVariants(),
                      "h-10 rounded-full bg-forest text-white hover:bg-forest-active"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => {
                      setIsOpen(false)
                      setSelectedAnchor(null)
                    }}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 rounded-full"
                    )}
                  >
                    Update Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 rounded-full border-coral/30 text-coral-dark hover:bg-coral/10"
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
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
