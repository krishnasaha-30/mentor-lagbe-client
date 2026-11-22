import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

/** Layout for public pages that show the site navbar and footer. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
