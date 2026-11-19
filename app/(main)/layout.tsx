import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/navbar"

/** Layout for public pages that show the site navbar. */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
