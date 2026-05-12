"use client"

export default function EditInfoCard({ username = "Akiyama Mizuki", 
    email = "amia.mizuki@niigo.nightcord", 
    country = "Japan" }: { username?: string; email?: string; country?: string }) {
  return (
    <section className="bg-white rounded-md p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-black">Edit Info</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-500">USERNAME</label>
          <input className="w-full mt-1 p-3 bg-gray-100 rounded text-black" defaultValue={username} />
        </div>

        <div>
          <label className="block text-xs text-gray-500">EMAIL ADDRESS</label>
          <input className="w-full mt-1 p-3 bg-gray-100 rounded text-black" defaultValue={email} />
        </div>

        <div>
          <label className="block text-xs text-gray-500">COUNTRY</label>
          <select className="w-full mt-1 p-3 bg-gray-100 rounded text-black" defaultValue={country}>
            <option>Japan</option>
            <option>United States</option>
            <option>United Kingdom</option>
            {/**We really need to fix this one soon */}
          </select>
        </div>
      </div>
    </section>
  )
}
