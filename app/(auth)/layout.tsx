import type { ReactNode } from "react"

import { AvatarRow } from "@/components/auth/avatar-row"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/theme-toggle"

/**
 * Split-screen shell shared by /sign-up and (later) /sign-in.
 * The forest panel is hidden on small screens where space is tight.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <ThemeToggle className="absolute top-4 right-4 z-10" />

      {/* Left: brand panel */}
      <aside className="hidden flex-col justify-between bg-forest p-14 lg:flex xl:p-16">
        <Logo tone="light" />

        <div className="flex flex-col gap-7">
          <AvatarRow />
          <p className="font-display text-[2.75rem] leading-[1.12] font-bold text-white xl:text-[3.25rem]">
            Learn better.
            <br />
            Teach smarter.
          </p>
        </div>
      </aside>

      {/* Right: form area */}
      <main className="flex flex-col px-5 py-8 sm:px-8 lg:justify-center lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
