import CheckoutPageClient from "@/components/ClientSideComponent/CheckoutPageComponent/checkout-page"
import CheckoutSkeleton from "@/components/ClientSideComponent/CheckoutPageComponent/checout-page-skeleton"
import { Suspense } from "react"


export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPageClient />
    </Suspense>
  )
}

