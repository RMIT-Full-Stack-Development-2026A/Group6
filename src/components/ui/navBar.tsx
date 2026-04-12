"use client"

import React from "react"

export default function NavBar() {
	return (
		<nav className="w-full bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex-shrink-0 text-xl font-semibold">TicTacToang</div>

					<div className="hidden sm:flex sm:items-center space-x-4">
						<a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Home</a>
						<a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Gamemodes</a>
						<a href="#" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pricing</a>
					</div>

					<div className="sm:hidden">
						<button aria-label="Open menu" className="p-2 rounded-md text-gray-600 hover:bg-gray-100">☰</button>
					</div>
				</div>
			</div>
		</nav>
	)
}

