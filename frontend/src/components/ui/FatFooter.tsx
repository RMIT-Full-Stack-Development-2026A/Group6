"use client"

import React from "react"
import Link from "next/link"

export default function FatFooter() {
  return (
    <div className="w-full bg-white shadow-sm border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 sm:h-16">
          <div className="text-gray-500 text-sm">RMIT Fullstack Group 6</div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-1 text-gray-400">
            <Link href="/cookies" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Cookies Settings</Link>
            <Link href="/privacy" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Privacy Notice</Link>
            <Link href="/tos" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  )
}