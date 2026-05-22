"use client"

import React, { createContext, useContext, useState } from "react"

type Selection = {
  mode?: string | null
  gridSize?: number | null
}

type SelectionContextValue = {
  selection: Selection
  setSelection: (s: Selection) => void
}

const SelectionContext = createContext<SelectionContextValue | null>(null)

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selection, setSelection] = useState<Selection>({ mode: null, gridSize: null })
  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error("useSelection must be used inside SelectionProvider")
  return ctx
}

export default SelectionContext
