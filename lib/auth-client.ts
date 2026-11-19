import type { auth } from "@/lib/auth"
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

/**
 * `inferAdditionalFields<typeof auth>()` copies the server schema to the client,
 * so fields declared in `lib/auth.ts` (like `role`) are typed here as well.
 */
export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient
