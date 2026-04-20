'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method')
      return
    }

    setLoading(true)
    setError(null)

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
          'Authorization': `Bearer ${token}`,
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
      setLoading(false)

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed')
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', backgroundColor: 'white' }}>
      <h1>Upgrade to Pro</h1>
      <p>Select your preferred payment method</p>

      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '20px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ color: 'green', padding: '10px', marginBottom: '20px', border: '1px solid green', borderRadius: '4px' }}>
          Payment successful! You've been upgraded to Pro. Redirecting...
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h3>Payment Amount: $10/month</h3>

        <div style={{ marginTop: '20px' }}>
          {['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'].map((method) => (
            <label key={method} style={{ display: 'block', marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: paymentMethod === method ? '#e8f5e9' : 'white' }}>
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ marginRight: '10px' }}
              />
              {method.replace(/_/g, ' ').toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || success}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: success ? '#4caf50' : '#2e7d32',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading || success ? 'not-allowed' : 'pointer',
          opacity: loading || success ? 0.6 : 1,
        }}
      >
        {loading ? 'Processing...' : success ? 'Payment Complete' : 'Pay Now'}
      </button>

      <button
        onClick={() => router.back()}
        disabled={loading}
        style={{
          width: '100%',
          marginTop: '10px',
          padding: '12px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        Cancel
      </button>
    </main>
  )
}
