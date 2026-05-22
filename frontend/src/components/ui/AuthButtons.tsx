"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

export default function AuthButtons() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsSignedIn(!!token)
  }, [])

  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/playfield">
        <div className="flex items-center space-x-4 text-white bg-[#006948] p-3 px-6 rounded-xl hover:bg-[#005237] transition-colors">
          Play Now
        </div>
      </Link>

      {!isSignedIn && (
        <>
          <Link href="/signup">
            <div className="flex items-center space-x-4 text-white bg-[#006948] p-3 px-6 rounded-xl hover:bg-[#005237] transition-colors">
              Sign up
            </div>
          </Link>
          <Link href="/login">
            <div className="flex items-center space-x-4 text-[#006948] border border-[#006948] bg-white p-3 px-6 rounded-xl hover:bg-[#ecfdf5] transition-colors">
              Login
            </div>
          </Link>
        </>
      )}
    </div>
  )
}