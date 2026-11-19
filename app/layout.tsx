import type { Metadata } from "next"
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google"

import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/theme-provider"

// Body font
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Display font used by the logo and big headings
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "MentorLagbe — Find your ideal tutor",
  description:
    "Find verified tutors for online and home tuition. Search by subject, class level and budget, then apply in minutes.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable}`}
    >
      <body className="min-h-svh bg-cream font-sans text-ink antialiased">
        <ThemeProvider defaultTheme="light">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
