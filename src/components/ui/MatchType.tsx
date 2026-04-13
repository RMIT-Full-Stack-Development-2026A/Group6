"use client"
import matchtype from "#/data/gamemode.json"

import React from "react"

type MatchTypeProps = {
    type: "online" | "local" | "bot" | string
}

export default function MatchType({ type }: MatchTypeProps) {
    const key = String(type)
    const text = matchtype.matchtype[key].desc || ""
    const iconSrc = `/matchType/${key}.svg`
    const title = matchtype.matchtype[key].name || ""

    return (
        <article className="bg-white rounded-lg shadow p-6 max-w-md flex flex-col gap-4">
            <div className="flex items-start">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                    <img src={iconSrc} alt={`${key} icon`} className="w-5 h-5" />
                </div>
            </div>

            <div className="px-0">
                <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-3 text-sm text-gray-600 leading-6">{text}</p>
            </div>

            <div className="flex items-center justify-between">
                <button className="bg-transparent text-emerald-600 font-bold flex items-center gap-3 p-0 focus:outline-none">
                    <span>SELECT MODE</span>
                    <span className="text-gray-400 font-semibold">→</span>
                </button>
            </div>
        </article>
    )
}