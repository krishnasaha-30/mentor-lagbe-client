export type AdminTuitionApproval = "approved" | "rejected"

export type PendingTuition = {
  id: string
  title: string
  subject: string
  classLevel: string
  mode: string
  location: string
  monthlyFee: number
  daysPerWeek: number
  description: string
  bannerImage: string | null
  createdAt: string
  tutor: {
    name: string
    email: string
    image: string | null
  } | null
}
