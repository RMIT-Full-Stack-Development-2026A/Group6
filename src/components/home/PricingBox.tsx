"use client"

import Link from "next/link"
import React from "react"
import subs from "#/data/subs.json"

type Tier = {
  cost: number
  benefits: string[]
}

export default function PricingBox({ current = "free" }: { current?: string }) {
  const entries = Object.entries(subs) as [string, Tier][]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {entries.map(([key, data]) => {
        const isCurrent = key.toLowerCase() === String(current).toLowerCase()
        const recommended = key.toLowerCase() === "pro" || key.toLowerCase() === "recommended"

        return (
          <div
            key={key}
            className={`rounded-lg p-6 shadow-sm ${isCurrent ? 'bg-gray-50' : 'bg-white'} ${recommended ? 'border-2 border-emerald-600' : 'border border-gray-100'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-4xl font-semibold text-black">{key === 'free' ? 'Free' : key}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-400">${data.cost}</div>
                <div className="text-sm text-gray-500">/MONTH</div>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {data.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
                  <span className="text-sm text-gray-700">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              {isCurrent ? (
                <button className="w-full py-3 border border-emerald-600 text-emerald-700 rounded">Current Plan</button>
              ) : (
                <Link href="/payment" className={`w-full inline-flex justify-center py-3 rounded ${recommended ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {recommended ? `Upgrade to ${key}` : `Choose ${key}`}
                </Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
