"use client"

export default function ProfileSidebar({ 
    username = "Akiyama Mizuki", 
    email = "amia.mizuki@niigo.nightcord", 
    premium = true 
}: { username?: string; email?: string; premium?: boolean }) {
  return (
    <aside className="w-64 bg-white rounded-lg p-6 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4">
          {/* placeholder avatar */}
          <img src="/pfp.png" alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-lg font-bold text-black">{username}</div>
        <div className="text-sm text-gray-500">{email}</div>
        {premium && <div className="mt-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs">PREMIUM</div>}
      </div>

      <nav className="mt-6 space-y-3">
        <button className="w-full text-gray-700 text-left px-3 py-2 bg-emerald-200 rounded flex items-center gap-3">Profile Info</button>
        <button className="w-full text-gray-700 text-left px-3 py-2 rounded flex items-center gap-3">Game History</button>
        <button className="w-full text-gray-700 text-left px-3 py-2 rounded flex items-center gap-3">Security</button>
        <button className="w-full text-gray-700 text-left px-3 py-2 rounded flex items-center gap-3">Subscription</button>
      </nav>
    </aside>
  )
}
