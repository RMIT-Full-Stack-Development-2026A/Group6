"use client"

import React from "react"

export default function FatFooter() {
    return (
        <div className="w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className={"text-gray-500"}>
                        RMIT Fullstack Group 6
                    </div>
                    <div className={"text-gray-400 flex justify-around gap-5"}>
                        <a href="/cookies" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Cookies Settings</a>
                        <a href="/privacy" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Privacy Notice</a>
                        <a href="/tos" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Terms of Service</a>
                    </div>
                </div>

            </div>
        </div>
    )
}
