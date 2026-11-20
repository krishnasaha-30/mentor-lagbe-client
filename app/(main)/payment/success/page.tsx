import { PaymentSuccess } from "@/components/billing/payment-success"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>
}) {
  const { session_id: sessionId } = await searchParams

  return (
    <PaymentSuccess
      sessionId={typeof sessionId === "string" ? sessionId : null}
    />
  )
}
