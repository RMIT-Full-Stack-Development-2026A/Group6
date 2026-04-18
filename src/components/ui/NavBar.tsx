"use client"

import React from "react"

export default function NavBar() {
	return (
		<div className="w-full bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex-shrink-0 text-xl font-semibold text-black">
                        <a href="#">TicTacToang</a>
                    </div>

					<div className="hidden sm:flex sm:items-center space-x-4">
						<a href="." className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Home</a>
						<a href="gamemodes" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Game Modes</a>
						<a href="subscription" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pricing</a>
					</div>

                    <a href={"#"}>
                        <div className="hidden sm:flex sm:items-center space-x-4 text-white bg-[#006948] p-3 px-6 rounded-xl">
                            Sign up
                        </div>
                    </a>

					<div className="sm:hidden">
						<button aria-label="Open menu" className="p-2 rounded-md text-gray-600 hover:bg-gray-100">☰</button>
					</div>
				</div>
			</div>
		</div>
	)
}

