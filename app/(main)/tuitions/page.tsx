import Link from "next/link"
import { Search } from "lucide-react"

import { TuitionCard } from "@/components/sections/tuition-card"
import { getPublicTuitions } from "@/lib/api/tuitions"

type TuitionSearchParams = {
  [key: string]: string | string[] | undefined
}

const filterKeys = ["q", "subject", "classLevel", "mode", "page", "limit"]

function getSingleValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : ""
}

function toApiQuery(searchParams: TuitionSearchParams) {
  const query = new URLSearchParams()

  for (const key of filterKeys) {
    const value = searchParams[key]

    if (typeof value === "string") {
      query.set(key, value)
    } else if (Array.isArray(value)) {
      for (const repeatedValue of value) {
        query.append(key, repeatedValue)
      }
    }
  }

  return query.toString()
}

function getPageHref(
  filters: { q: string; subject: string; classLevel: string; mode: string },
  page: number
) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value) query.set(key, value)
  }

  query.set("page", String(page))
  return `/tuitions?${query.toString()}`
}

export default async function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<TuitionSearchParams>
}) {
  const params = await searchParams
  const filters = {
    q: getSingleValue(params.q),
    subject: getSingleValue(params.subject),
    classLevel: getSingleValue(params.classLevel),
    mode: getSingleValue(params.mode),
  }

  let response = null
  let loadError = false

  try {
    response = await getPublicTuitions(toApiQuery(params))
  } catch (error) {
    console.error("Could not load public tuitions:", error)
    loadError = true
  }

  const pagination = response?.pagination
  const firstPage = pagination ? Math.max(1, pagination.currentPage - 2) : 1
  const lastPage = pagination
    ? Math.min(pagination.totalPages, pagination.currentPage + 2)
    : 0

  return (
    <>
      <section className="bg-mint py-9 sm:py-12">
        <div className="page-container">
          <p className="text-xs font-semibold tracking-[0.16em] text-forest uppercase">
            Find your next tutor
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight font-bold tracking-[-0.02em] text-ink sm:text-4xl">
            Browse Tuitions
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Search approved, active tuition listings by subject, class, and
            mode.
          </p>

          <form
            action="/tuitions"
            method="get"
            role="search"
            className="mt-6 grid gap-3 rounded-[20px] bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(140px,1fr))_auto] lg:items-end"
          >
            <label className="block text-xs font-semibold text-ink">
              Search
              <span className="relative mt-1.5 block">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft"
                />
                <input
                  type="search"
                  name="q"
                  maxLength={100}
                  defaultValue={filters.q}
                  placeholder="Title or subject..."
                  className="h-11 w-full rounded-lg border border-line bg-white pr-3 pl-10 text-sm font-normal text-ink transition outline-none focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
                />
              </span>
            </label>

            <label className="block text-xs font-semibold text-ink">
              Subject
              <select
                name="subject"
                defaultValue={filters.subject}
                className="mt-1.5 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm font-normal text-ink outline-none focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
              >
                <option value="">All subjects</option>
                {[
                  "Math",
                  "Physics",
                  "Programming",
                  "IELTS",
                  "English",
                  "Chemistry",
                ].map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-semibold text-ink">
              Class level
              <select
                name="classLevel"
                defaultValue={filters.classLevel}
                className="mt-1.5 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm font-normal text-ink outline-none focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
              >
                <option value="">All levels</option>
                {[
                  "Class 1-5",
                  "Class 6-10",
                  "Class 8+",
                  "Class 9-10",
                  "Class 11-12",
                  "Adult",
                ].map((classLevel) => (
                  <option key={classLevel} value={classLevel}>
                    {classLevel}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-semibold text-ink">
              Mode
              <select
                name="mode"
                defaultValue={filters.mode}
                className="mt-1.5 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm font-normal text-ink outline-none focus-visible:border-forest/60 focus-visible:ring-3 focus-visible:ring-forest/15"
              >
                <option value="">Online / offline</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </label>

            <button
              type="submit"
              className="h-11 rounded-full bg-coral px-6 text-sm font-semibold text-ink transition-colors hover:bg-coral-dark"
            >
              Apply filters
            </button>
          </form>
        </div>
      </section>

      <main className="page-container py-9 sm:py-12">
        {loadError ? (
          <div
            role="alert"
            className="rounded-2xl border border-coral/40 bg-white px-5 py-8 text-center text-sm text-ink"
          >
            Tuition listings could not be loaded. Please try again later.
          </div>
        ) : response ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">
                  Tuition listings
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {response.pagination.totalItems}{" "}
                  {response.pagination.totalItems === 1
                    ? "tuition"
                    : "tuitions"}{" "}
                  found
                </p>
              </div>
              {(filters.q ||
                filters.subject ||
                filters.classLevel ||
                filters.mode) && (
                <Link
                  href="/tuitions"
                  className="text-sm font-semibold text-forest underline underline-offset-4"
                >
                  Clear filters
                </Link>
              )}
            </div>

            {response.tuitions.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {response.tuitions.map((tuition) => (
                  <TuitionCard key={tuition.id} tuition={tuition} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[20px] border border-line bg-white px-5 py-14 text-center">
                <h3 className="font-display text-xl font-bold text-ink">
                  No tuitions found
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  Try changing your search or clearing one of the filters.
                </p>
              </div>
            )}

            {pagination && pagination.totalPages > 1 ? (
              <nav
                aria-label="Tuition pagination"
                className="mt-8 flex flex-wrap items-center justify-center gap-2"
              >
                <Link
                  aria-disabled={pagination.currentPage === 1}
                  tabIndex={pagination.currentPage === 1 ? -1 : undefined}
                  href={getPageHref(
                    filters,
                    Math.max(1, pagination.currentPage - 1)
                  )}
                  className={`rounded-full border border-line px-4 py-2 text-sm font-medium ${
                    pagination.currentPage === 1
                      ? "pointer-events-none text-ink-soft/50"
                      : "bg-white text-ink hover:bg-cream-soft"
                  }`}
                >
                  Previous
                </Link>

                {Array.from(
                  { length: Math.max(0, lastPage - firstPage + 1) },
                  (_, index) => firstPage + index
                ).map((page) => (
                  <Link
                    key={page}
                    aria-current={
                      page === pagination.currentPage ? "page" : undefined
                    }
                    href={getPageHref(filters, page)}
                    className={`grid size-10 place-items-center rounded-full border text-sm font-semibold ${
                      page === pagination.currentPage
                        ? "border-forest bg-forest text-white"
                        : "border-line bg-white text-ink hover:bg-cream-soft"
                    }`}
                  >
                    {page}
                  </Link>
                ))}

                <Link
                  aria-disabled={
                    pagination.currentPage === pagination.totalPages
                  }
                  tabIndex={
                    pagination.currentPage === pagination.totalPages
                      ? -1
                      : undefined
                  }
                  href={getPageHref(
                    filters,
                    Math.min(pagination.totalPages, pagination.currentPage + 1)
                  )}
                  className={`rounded-full border border-line px-4 py-2 text-sm font-medium ${
                    pagination.currentPage === pagination.totalPages
                      ? "pointer-events-none text-ink-soft/50"
                      : "bg-white text-ink hover:bg-cream-soft"
                  }`}
                >
                  Next
                </Link>
              </nav>
            ) : null}
          </>
        ) : null}
      </main>
    </>
  )
}
