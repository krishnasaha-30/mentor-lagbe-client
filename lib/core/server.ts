import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

/** Express API origin. Override with NEXT_PUBLIC_API_BASE_URL if needed. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000"

/**
 * Server-side session lookup. Because the session cookie is sent with the
 * request, this restores the logged-in user after a reload.
 */
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

/**
 * Returns the BetterAuth session token ("the JWT") that the Express API
 * expects in the Authorization header. Redirects when signed out.
 */
export async function getToken() {
  const session = await getSession()

  if (!session || !session.session?.token) {
    redirect("/unauthorized")
  }

  return session.session.token
}

/**
 * Authenticated GET (or any request) against the Express API.
 * Adds `Authorization: Bearer <token>` and handles 401/403 centrally.
 */
export async function authFetch(api: string, init: RequestInit = {}) {
  const token = await getToken()
  const requestHeaders = new Headers(init.headers)
  requestHeaders.set("authorization", `Bearer ${token}`)

  const res = await fetch(api, {
    ...init,
    headers: requestHeaders,
    // Never cache user-specific data.
    cache: "no-store",
  })

  if (res.status === 401 || res.status === 403) {
    redirect("/unauthorized")
  }

  return res
}

/** Authenticated write (POST / PATCH / PUT / DELETE) against the Express API. */
export async function protectedMutation(
  api: string,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  data?: unknown
) {
  const token = await getToken()

  const res = await fetch(api, {
    method,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: data ? JSON.stringify(data) : null,
    cache: "no-store",
  })

  if (res.status === 401 || res.status === 403) {
    redirect("/unauthorized")
  }

  return res
}

/**
 * Use inside a page/layout to guard by role, e.g.
 *   await requireRole("tutor")
 */
export async function requireRole(role: "student" | "tutor" | "admin") {
  const session = await getSession()

  if (!session || session.user.role !== role) {
    redirect("/unauthorized")
  }

  return session
}
