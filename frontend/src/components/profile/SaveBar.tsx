"use client"

export default function SaveBar({ onSave, onDiscard }: { onSave?: () => void; onDiscard?: () => void }) {
  return (
    <div className="flex items-center justify-end gap-6 mt-6">
      <button onClick={onDiscard} className="text-gray-600">Discard Changes</button>
      <button onClick={onSave} className="px-6 py-3 bg-emerald-700 text-white rounded shadow">Save Changes</button>
    </div>
  )
}
