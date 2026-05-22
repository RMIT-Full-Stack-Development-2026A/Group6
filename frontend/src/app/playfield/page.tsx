import React, { Suspense } from "react"
import PlayfieldClient from "./PlayfieldClient"

export default function PlayfieldPage() {
  return (
    <Suspense fallback={<div />}> 
      <PlayfieldClient />
    </Suspense>
  )
}