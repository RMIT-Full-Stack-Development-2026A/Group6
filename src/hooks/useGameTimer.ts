import { useEffect, useRef, useState } from "react"
import { GameStatus } from "@/context/gameContext"

export function useGameTimer(status: GameStatus): string {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevStatus = useRef<GameStatus>("idle")

  useEffect(() => {
    // Reset only when a fresh game starts (anything → in-progress)
    if (prevStatus.current !== "in-progress" && status === "in-progress") {
      setElapsed(0)
    }
    prevStatus.current = status

    if (status === "in-progress") {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status])

  const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0")
  const seconds = (elapsed % 60).toString().padStart(2, "0")
  return `${minutes}:${seconds}`
}