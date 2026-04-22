"use client"

import Image from "next/image";

type SidebarProps = {
  username?: string
  email?: string
  premium?: boolean
  active?: string
  onSelect?: (tab: string) => void
}

export default function ProfileSidebar({ 
  username = "Akiyama Mizuki", 
  email = "amia.mizuki@niigo.nightcord", 
  premium = true,
  active = 'profile',
  onSelect
}: SidebarProps) {
  const btn = (id: string, label: string) => (
    <button
      onClick={() => onSelect && onSelect(id)}
      className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 cursor-pointer ${active === id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'}`}
    >
      {label}
    </button>
  )

  return (
    <aside className="w-64 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
          {/* placeholder avatar */}
          <Image src="/pfp.png" alt="avatar" className="w-full h-full object-cover" width={100} height={100}/>
        </div>
        <div className="text-lg font-bold text-black">{username}</div>
        <div className="text-sm text-gray-500">{email}</div>
        {premium && <div className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">PREMIUM</div>}
      </div>

      <nav className="mt-6 space-y-3">
        {btn('profile', 'Profile Info')}
        {btn('history', 'Game History')}
        {btn('security', 'Security')}
        {btn('subscription', 'Subscription')}
      </nav>
    </aside>
  )
}
