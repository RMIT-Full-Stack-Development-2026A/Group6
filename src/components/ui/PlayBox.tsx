"use client"

import React from "react"
type CharTypeProp = {
    char: "X" | "O" | string
}
export default function PlayBox({char}: CharTypeProp) {
    return (
        <div className={char ? "bg-gray-500 w-20 h-20 text-center text-white flex items-center justify-center" : "bg-gray-200 w-20 h-20 text-center text-white flex items-center justify-center"}>
            <div className={'text-3xl'}>{char}</div>
        </div>
    )
}