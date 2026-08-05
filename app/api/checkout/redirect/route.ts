import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' })

export async function GET(req: NextRequest) {
  try {
    const plan = req.nextUrl.searchParams.get('plan')
    const referralCode = req.nextUrl.searchParams.get('ref')

    if (!plan || !['monthly', 'lifetime'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceMap: { [key: string]: string } = {
      monthly: 'price_1TobjQJNoeJRHPk7RKpy2zlu',
      lifetime: 'price_1TobzBJNoeJRHPk7eRAT9sRb',
    }

    const priceId = priceMap[plan]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://preemiyum.com?checkout=success',
      cancel_url: 'https://preemiyum.com?checkout=cancelled',
      metadata: {
        referral_code: referralCode || 'direct',
        product_type: plan,
      },
    })

    return NextResponse.redirect(session.url || 'https://preemiyum.com', { status: 303 })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.redirect('https://preemiyum.com?error=checkout_failed', { status: 303 })
  }
}
