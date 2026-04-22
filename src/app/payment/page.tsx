'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  subscription: boolean
  subscriptionExpires: string | null
}

function formatExpiryDate(expiry: string | null) {
  if (!expiry) return 'Not available'
  return new Date(expiry).toLocaleString()
}

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.data) {
          setProfile({
            subscription: data.data.subscription,
            subscriptionExpires: data.data.subscriptionExpires || null,
          })
        }
      })
      .catch(() => {
        // ignore
      })
  }, [])

  const statusMessage = useMemo(() => {
    if (!profile) return 'Loading subscription status...'
    if (profile.subscription) {
      return profile.subscriptionExpires
        ? 'Your monthly subscription is active. Expires on ${formatExpiryDate(profile.subscriptionExpires)}'
        : 'Your monthly subscription is active.'
    }
    return 'You do not have an active subscription. Pay $10/month to activate.'
  }, [profile])

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }

    setLoading(true)
    setError(null)
    setCancelSuccess(null)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Please login first')
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentMethod }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.message || 'Payment failed')
        setLoading(false)
        return
      }

      setSuccess(true)
      setProfile({
        subscription: true,
        subscriptionExpires: data.user.subscriptionExpires,
      })
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Please login first')
        setLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payments/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.message || 'Cancel subscription failed')
        setLoading(false)
        return
      }

      setProfile({
        subscription: false,
        subscriptionExpires: null,
      })
      setCancelSuccess(data.message || 'Subscription canceled successfully.')
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel subscription failed')
      setLoading(false)
    }
  }

  return (
    <main style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: '30px', backgroundColor: '#f4f5f7', color: '#111' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Subscription</h1>
        <p style={{ marginTop: '10px', color: '#555', lineHeight: 1.6 }}>
          Manage your subscription and renewal date.
        </p>

        {error && (
          <div style={{ marginTop: '20px', color: 'red', padding: '12px', borderRadius: '12px', backgroundColor: '#fff1f2' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ marginTop: '20px', color: '#0f5132', padding: '12px', borderRadius: '12px', backgroundColor: '#d1e7dd' }}>
            Payment successful. Your subscription is active.
          </div>
        )}

        {cancelSuccess && (
          <div style={{ marginTop: '20px', color: '#0c4128', padding: '12px', borderRadius: '12px', backgroundColor: '#eaf7ed' }}>
            {cancelSuccess}
          </div>
        )}

        <div style={{ marginTop: '24px', padding: '20px', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Status</p>
          <p style={{ marginTop: '8px', color: '#475569' }}>{statusMessage}</p>
          {profile?.subscription && profile.subscriptionExpires && (
            <p style={{ marginTop: '12px', color: '#475569' }}>
              Renewal date: <strong>{formatExpiryDate(profile.subscriptionExpires)}</strong>
            </p>
          )}
        </div>

        <div style={{ marginTop: '24px' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Choose payment method</p>
          <div style={{ marginTop: '12px', display: 'grid', gap: '10px' }}>
            {['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'].map((method) => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${paymentMethod === method ? '#2e7d32' : '#cbd5e1'}`, backgroundColor: paymentMethod === method ? '#ecfdf5' : '#fff' }}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span style={{ color: '#111' }}>{method.replace(/_/g, ' ').toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
          <button
            onClick={handlePayment}
            disabled={loading || profile?.subscription === true}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: profile?.subscription ? '#94a3b8' : '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: loading || profile?.subscription ? 'not-allowed' : 'pointer',
              opacity: loading || profile?.subscription ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : profile?.subscription ? 'Subscription active' : 'Pay $10'}
          </button>

          {profile?.subscription && (
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#c02628',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              Cancel subscription
            </button>
          )}

          <button
            onClick={() => router.back()}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#f8fafc',
              color: '#111',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Back
          </button>
        </div>
      </div>
    </main>
  )
}
