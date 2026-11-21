function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

async function getBrowserAccessToken() {
  const response = await fetch("/api/auth/token", {
    cache: "no-store",
  })
  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error("The server returned an invalid access token response.")
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.message === "string"
        ? payload.message
        : "Unable to retrieve an access token. Please sign in again."
    throw new Error(message)
  }

  if (!isRecord(payload) || typeof payload.token !== "string") {
    throw new Error("The server did not return a valid access token.")
  }

  return payload.token
}

export async function fetchWithAccessToken(
  input: RequestInfo | URL,
  token: string,
  init: RequestInit = {}
) {
  const accessToken =
    typeof window === "undefined" ? token : await getBrowserAccessToken()
  const headers = new Headers(init.headers)
  headers.set("authorization", `Bearer ${accessToken}`)

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store",
  })
}
