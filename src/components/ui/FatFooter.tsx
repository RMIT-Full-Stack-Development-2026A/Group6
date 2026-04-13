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
                        <div>Cookies Settings</div>
                        <div>Privacy Notice</div>
                        <div>Terms of Service</div>
                    </div>
                </div>

            </div>
        </div>
    )
}
