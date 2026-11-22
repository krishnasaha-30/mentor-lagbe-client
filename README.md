# MentorLagbe — Smart Tuition & Mentorship Platform

MentorLagbe is a full-stack, role-based tuition marketplace for Bangladesh.
Students find admin-approved tuition batches and apply in minutes, tutors post
their batches and manage applicants, and admins moderate listings, users and
Stripe subscription revenue.

## Live URLs

| Service        | URL                                                     |
| -------------- | ------------------------------------------------------- |
| Client (Next)  | https://mentor-lagbe-client-six.vercel.app               |
| API (Express)  | https://mentor-lagbe-server-omega.vercel.app            |
| Health check   | https://mentor-lagbe-server-omega.vercel.app/api/health |

## Demo credentials

| Role    | Email                          | Password      |
| ------- | ------------------------------ | ------------- |
| Admin   | `admin@mentorlagbe.com`        | `Admin@12345` |
| Tutor   | `tutor@mentorlagbe.com`        | `Tutor@12345` |
| Student | `student@mentorlagbe.com`      | `Student@12345` |

> The admin account is promoted in the database; the public sign-up form can
> only create students and tutors.

## Key features

### Public site

- Branded landing page with hero, animated subject marquee, featured tuitions,
  how-it-works, platform statistics, testimonials, pricing and FAQ.
- Browse tuitions with server-side search (title/subject) and filters
  (subject, class level, Online/Offline) plus pagination.
- Rich tuition details page with banner, tutor summary and the student-only
  application form (duplicate applications are blocked).
- Pricing page with Free, Pro Tutor ($15) and Pro Student ($10) plans.
- Responsive navbar/footer, contact details and the new X logo in social links.
- Light/dark theme toggle, smooth page/scroll animations, reduced-motion support.
- Custom loading, 404 and error-boundary pages with “Back to Home”.

### Authentication

- BetterAuth email/password plus optional Google sign-in.
- JWT access tokens signed with EdDSA and verified by Express middleware
  (`verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`).
- Role is selected at sign-up (Student or Tutor) and defaults to the free plan.
- Sessions survive reloads on every private route.

### Student dashboard

- Overview: total applied, accepted, pending and current plan.
- My applications: tuition, tutor (name & email), fee, schedule, applied date and status.
- Cancel a pending application.
- Saved Tuitions: bookmark favorite tuitions and view them in a dedicated dashboard tab.
- Student Review & Rating System: submit 1-5 star ratings and feedback for accepted tuitions.
- Update profile with name, phone, bio and ImgBB photo upload.

### Tutor dashboard

- Overview: posted tuitions, active/approved, applicants and plan.
- Post a tuition with validation and an ImgBB banner upload. Free tutors can
  create up to 2 posts; Pro tutors have unlimited posts.
- My tuitions: full CRUD, approval status, open/close toggle.
- Applicants: student contact details, schedule, note, accept/reject.
- Update profile with name, phone, bio and ImgBB photo upload.

### Admin dashboard

- Overview: users, tutors, pending/approved tuitions and Stripe revenue.
- User management with role updates.
- Tuition approval queue (approve/reject).
- Transaction history from the `payments` collection (name, email, plan,
  amount, date, invoice).
- Update profile.

### Payments

- Stripe Checkout for Pro Tutor ($15) and Pro Student ($10).
- Stripe webhook + checkout verification update `plan: "pro"` in `users` and
  store each paid invoice in `payments`.
- Billing portal for managing/cancelling a subscription.
- `/payment/success` and `/payment/cancel` result pages.

## Tech stack

| Layer            | Tools                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Frontend         | Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn-style UI |
| Icons / motion   | lucide-react, CSS animations, `next/image`                             |
| Auth             | BetterAuth (MongoDB adapter, JWT plugin, Google provider)             |
| Backend          | Node.js, Express, MongoDB driver                                       |
| Payments / media | Stripe Checkout + webhooks, ImgBB API                                  |
| Notifications    | Sonner                                                                |

Main npm packages: `next`, `react`, `better-auth`, `@better-auth/mongo-adapter`,
`mongodb`, `lucide-react`, `sonner`, `next-themes`, `tailwindcss`, `stripe`,
`express`, `cors`, `dotenv`, `jose`.

## Project structure

```
mentor-lagbe-client/   Next.js app (UI, BetterAuth, dashboards)
mentor-lagbe-server/   Express API + MongoDB (JWT, Stripe, uploads)
```

Important client routes:

```
/                         home
/tuitions                 browse + search/filter/pagination
/tuitions/[id]            details + apply form
/pricing                  Free / Pro plans
/sign-in, /sign-up        authentication
/payment/success|cancel   Stripe result pages
/dashboard                role-aware overview
/dashboard/student        student overview
/dashboard/student/my-applications
/dashboard/student/saved-tuitions
/dashboard/tutor          tutor overview
/dashboard/tutor/post-tuition
/dashboard/tutor/my-tuitions
/dashboard/tutor/applicants
/dashboard/admin          admin overview
/dashboard/admin/users
/dashboard/admin/tuitions
/dashboard/admin/transactions
/dashboard/profile        shared profile editor
```

## Local setup

### 1. Client

```bash
cd mentor-lagbe-client
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm run dev
```

`.env.local` variables:

```env
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
MongoDB_URI=mongodb://localhost:27017/mentor-lagbe-app
GOOGLE_CLIENT_ID=optional_google_client_id
GOOGLE_CLIENT_SECRET=optional_google_client_secret
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 2. Server

```bash
cd mentor-lagbe-server
npm install
cp .env.example .env            # then fill in the real values
npm run seed                    # adds 10 approved demo tuitions
npm run dev
```

Server variables: `MONGODB_URI`, `PORT`, `CLIENT_URL`, `IMGBB_API_KEY`,
`STRIPE_SECRET_KEY`, `STRIPE_PRO_TUTOR_PRICE_ID`,
`STRIPE_PRO_STUDENT_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`.

Stripe webhook while developing:

```bash
stripe listen \
  --events customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.paid \
  --forward-to localhost:5000/api/stripe/webhook
```

## Database (4 collections)

1. `user` — BetterAuth accounts, role (`student`/`tutor`/`admin`), plan.
2. `tuitions` — listings with approval status, active flag and tutor id.
3. `applications` — student applications with schedule, note and status.
4. `payments` — paid Stripe subscription invoices.

`npm run seed` in the server folder is idempotent and inserts 12 realistic
approved tuitions across Math, Physics, Programming, IELTS, English,
Chemistry, Biology, Economics, Accounting, ICT, Statistics and Bangla, along
with sample applications and verified demo accounts.

## Submission Checklist

- **Admin Email:** `admin@mentorlagbe.com`
- **Admin Password:** `Admin@12345`
- **Tutor Email:** `tutor@mentorlagbe.com`
- **Tutor Password:** `Tutor@12345`
- **Student Email:** `student@mentorlagbe.com`
- **Student Password:** `Student@12345`
- **Live Site Link (Client):** https://mentor-lagbe-client-six.vercel.app
- **Live Server Link (API):** https://mentor-lagbe-server-omega.vercel.app
- **GitHub Repository (Client):** https://github.com/
- **GitHub Repository (Server):** https://github.com/

## Quality checks

```bash
# client
npm run typecheck
npm run lint
npm run build

# server
npm test
```

## Notes

- All secrets stay in `.env` / `.env.local`; only `NEXT_PUBLIC_*` values reach
  the browser.
- New profiles and tuition banners are uploaded to ImgBB through the Express API.
- Seeded photos live in `public/photos/` and are credited to Unsplash
  contributors in the footer.
