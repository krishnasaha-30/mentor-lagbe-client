# MentorLagbe

**MentorLagbe** is a full-stack tutor-finding platform where students can discover and apply to tuition posts, tutors can list their services, and admins can manage the entire ecosystem — all with role-based access control, subscription billing, and JWT-secured APIs.

---

## 🌐 Live URL

🔗 [https://mentor-lagbe-client-six.vercel.app](https://mentor-lagbe-client-six.vercel.app)

---

## 🔐 Admin Credentials

| Role    | Email                   | Password      |
| ------- | ----------------------- | ------------- |
| Admin   | test_admin123@gmail.com   | testdmin@123   |
| Tutor   | tutor@gmail.com   | 123456   |


---

## 🎯 Purpose

MentorLagbe bridges the gap between students seeking quality tutoring and experienced tutors looking to offer their services. The platform supports:

- Students browsing and applying to tuition listings
- Tutors posting and managing their tuition offers
- Admins overseeing users, tuitions, applications, and reviews
- Subscription-based pro plans powered by Stripe

---

## ✨ Key Features

- 🔐 **Authentication** — Email/password sign-up & sign-in via BetterAuth with JWT plugin
- 👥 **Role-Based Access** — Three roles: `admin`, `tutor`, `student` with protected dashboards
- 📚 **Tuition Listings** — Tutors post tuitions; admins approve/reject; students browse & apply
- 📝 **Applications System** — Students apply to tuitions; tutors accept/reject applications
- ⭐ **Reviews** — Students leave reviews on completed tuitions
- 💳 **Stripe Subscriptions** — Pro plans for tutors and students with Stripe Checkout & webhooks
- 📊 **Admin Dashboard** — Overview stats: total users, tuitions, applications, revenue
- 🌙 **Dark Mode** — Full light/dark theme support via `next-themes`
- 📱 **Responsive UI** — Built with Tailwind CSS v4 and shadcn/ui components
- 🔒 **Secure API** — Express server validates EdDSA JWT tokens via BetterAuth JWKS endpoint

---

## 📦 NPM Packages Used

### Frontend — `mentor-lagbe-client`

| Package                     | Version   | Purpose                             |
| --------------------------- | --------- | ----------------------------------- |
| `next`                      | 16.4.5    | React framework with App Router     |
| `react`                     | 19.3.1    | UI library                          |
| `react-dom`                 | 19.3.1    | DOM rendering                       |
| `better-auth`               | ^1.7.26   | Authentication (email/password+JWT) |
| `@better-auth/mongo-adapter`| ^1.7.26   | MongoDB adapter for BetterAuth      |
| `mongodb`                   | ^7.9.0    | MongoDB driver                      |
| `@base-ui/react`            | ^1.9.0    | Headless accessible UI primitives   |
| `shadcn`                    | ^4.23.0   | UI component library                |
| `lucide-react`              | ^1.76.0   | Icon library                        |
| `class-variance-authority`  | ^0.7.1    | Variant-based className utility     |
| `cn`                        | ^0.5.2    | Conditional className helper        |
| `next-themes`               | ^0.4.6    | Dark / light mode support           |
| `sonner`                    | ^2.0.8    | Toast notifications                 |
| `tailwindcss`               | ^4        | Utility-first CSS framework         |
| `tw-animate-css`            | ^1.4.0    | Tailwind CSS animations             |
| `typescript`                | ^5        | Static typing                       |
| `prettier`                  | ^3.9.10   | Code formatter                      |
| `prettier-plugin-tailwindcss` | ^0.8.1  | Auto-sort Tailwind classes          |
| `eslint`                    | ^9        | Linting                             |

### Backend — `mentor-lagbe-server`

| Package   | Version    | Purpose                          |
| --------- | ---------- | -------------------------------- |
| `express` | ^5.3.0     | HTTP server & REST API           |
| `mongodb` | ^7.9.0     | MongoDB driver                   |
| `bcrypt`  | ^6.0.0     | Password hashing                 |
| `jose`    | ^6.2.18    | JWT verification via JWKS        |
| `cors`    | ^2.8.6     | Cross-origin request handling    |
| `dotenv`  | ^18.0.10   | Environment variable loading     |
| `stripe`  | ^23.2.0    | Payments & webhook handling      |

---

## 🗂️ Project Structure

```
mentor-lagbe-client/          # Next.js 16 frontend (Vercel)
├── app/
│   ├── (auth)/               # Sign-in, Sign-up pages
│   ├── (main)/               # Public pages (home, tutors, tuitions)
│   ├── (dashboard)/          # Protected dashboards (admin, tutor, student)
│   └── api/                  # BetterAuth API route handler
├── components/               # Reusable UI components
└── lib/
    ├── auth.ts               # BetterAuth server config
    └── auth-client.ts        # BetterAuth client config

mentor-lagbe-server/          # Express REST API
├── index.js                  # Main server + all API routes
├── db.js                     # MongoDB collections
├── middleware/auth.js        # JWT verification middleware
├── lib/                      # Validation & business logic helpers
└── seed.js                   # Demo data seeder
```



## 🔗 GitHub Repositories

- **Client:** [github.com/krishnasaha-30/mentor-lagbe-client](https://github.com/krishnasaha-30/mentor-lagbe-client)
- **Server:** [github.com/krishnasaha-30/mentor-lagbe-server](https://github.com/krishnasaha-30/mentor-lagbe-server)
