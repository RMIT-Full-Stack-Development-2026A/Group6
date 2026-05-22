"use client" 

import { useEffect, useState } from 'react'
import PricingBox from './PricingBox'
import { getProfile } from '@/services/userService'

export default function PricingSection() {
  const [currentPlan, setCurrentPlan] = useState('free')

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setCurrentPlan(profile.subscription ? 'pro' : 'free')
      })
      .catch(() => {
        setCurrentPlan('free')
      })
  }, []) 

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <PricingBox current={currentPlan} />
      </div>
    </section>
  )
}
