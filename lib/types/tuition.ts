export type PublicTuition = {
  id: string
  title: string
  subject: string
  classLevel: string
  mode: string
  location: string
  monthlyFee: number
  daysPerWeek: number
  bannerImage: string | null
  tutor: {
    name: string
    image: string | null
    plan: "free" | "pro"
  } | null
}

export type TuitionSearchResponse = {
  tuitions: PublicTuition[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
}

export type NewTuitionInput = {
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  location: string
  monthlyFee: number
  daysPerWeek: number
  description: string
  bannerImage: string | null
}

export type TutorPostUsage = {
  plan: "free" | "pro"
  postsUsed: number
  postsLimit: number | null
  canCreate: boolean
}
