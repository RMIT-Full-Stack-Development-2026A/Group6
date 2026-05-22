"use client"

export default function GameplayPreferences({ preferred = "X" }: { preferred?: string }) {
  return (
    <section className="bg-white rounded-md p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-black">Gameplay Preferences</h3>
      <div className="text-sm text-gray-500 mb-4">Select your default signature mark for all matches.</div>

      <div className="flex gap-4">
        <button className={`w-32 h-32 rounded border ${preferred === 'X' ? 'border-emerald-600' : 'border-gray-200'} flex items-center justify-center flex-col`}>
          <div className="text-2xl font-bold text-emerald-700">X</div>
          <div className="text-xs text-gray-500 mt-2">PREFERRED X</div>
        </button>

        <button className={`w-32 h-32 rounded border ${preferred === 'O' ? 'border-emerald-600' : 'border-gray-200'} flex items-center justify-center flex-col`}>
          <div className="text-2xl font-bold text-gray-500">O</div>
          <div className="text-xs text-gray-500 mt-2">SELECT O</div>
        </button>
      </div>
    </section>
  )
}
