"use client"

export default function AccountSecurity() {
  return (
    <section className="bg-white rounded-md p-6 shadow-sm flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-black">Account Security</h4>
        <div className="text-sm text-gray-500">Keep your architectural vault secure.</div>
      </div>
      <div>
        <button className="px-4 py-2 bg-emerald-700 rounded text-white">Change Password</button>
      </div>
    </section>
  )
}
