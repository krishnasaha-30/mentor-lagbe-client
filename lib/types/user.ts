// Roles mirror the `user.additionalFields.role` enum in `lib/auth.ts`.
// "admin" is assigned in the database, not chosen at sign-up.
export type UserRole = "student" | "tutor" | "admin"

// Plans mirror the `user.additionalFields.plan` enum in `lib/auth.ts`.
export type UserPlan = "free" | "pro"
