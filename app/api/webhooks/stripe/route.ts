import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook, verifyWebhookSignature } from '@/lib/stripe/webhook-handler'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
  }

  try {
    const event = verifyWebhookSignature(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    await handleStripeWebhook(event)
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook error:', error)
    return NextResponse.json({ error }, { status: 400 })
  }
}
