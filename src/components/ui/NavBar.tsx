"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { logout } from "@/services/authService"

export default function NavBar() {
	const pathname = usePathname()
	const router = useRouter()
	const [isSignedIn, setIsSignedIn] = useState(false)
	const isAdminPage = pathname?.startsWith("/admin")

	useEffect(() => {
		setIsSignedIn(Boolean(localStorage.getItem("authToken")))
	}, [])

	if (isAdminPage) {
		return (
			<div className="w-full bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center">
						<div className="shrink-0 text-xl font-semibold text-black">
							<Link href="/">TicTacToang</Link>
						</div>

						<div className="flex-1 flex justify-center">
							<div className="max-w-md w-full">
								<input
									type="text"
									placeholder="Search users, rooms, settings..."
									className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>

						<div className="sm:hidden">
							<button aria-label="Open menu" className="p-2 rounded-md text-gray-600 hover:bg-gray-100">☰</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const homeHref = isSignedIn ? "/home" : "/"
	const profileHref = isSignedIn ? "/profile" : "/signup"
	const pricingHref = isSignedIn ? "/subscription" : "/signup"
	const hideSignupButton = pathname === "/home" || pathname === "/profile" || pathname?.startsWith("/profile/") || isSignedIn

	async function handleLogout() {
		await logout()
		setIsSignedIn(false)
		router.push("/")
	}

	return (
		<div className="w-full bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="shrink-0 text-xl font-semibold text-black">
                        <Link href="/">TicTacToang</Link>
                    </div>

					<div className="hidden sm:flex sm:items-center space-x-4">
						<Link href={homeHref} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Home</Link>
						<Link href={"/gamemodes"} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Game Modes</Link>
				<Link href={pricingHref} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Pricing</Link>
						<Link href={profileHref} className="px-3 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
						{isSignedIn && (
							<button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium text-white bg-[#006948] hover:bg-[#005237]">
								Logout
							</button>
						)}
					</div>

                    {!hideSignupButton && (
                        <Link href={'/signup'}>
                            <div className="hidden sm:flex sm:items-center space-x-4 text-white bg-[#006948] p-3 px-6 rounded-xl">
                                Sign up
                            </div>
                        </Link>
                    )}

					<div className="sm:hidden">
						<button aria-label="Open menu" className="p-2 rounded-md text-gray-600 hover:bg-gray-100">☰</button>
					</div>
				</div>
			</div>
		</div>
	)
}

