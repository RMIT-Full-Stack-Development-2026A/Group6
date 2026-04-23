"use client"

import React from "react"
import PlayfieldBoard from "@/components/playfield/PlayfieldBoard"
import PlayfieldSidebar from "@/components/playfield/PlayfieldSidebar"

export default function PlayfieldTemplate() {
  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-6xl mx-auto flex gap-8">
        <PlayfieldBoard rows={15} cols={15} />
        <PlayfieldSidebar />
      </div>
    </div>
  )
}
