import React from "react"

export default function ClosedState({ message }: { message: string }) {
  return (
    <div className="mb-16 px-4">
      <div className="p-10 flex flex-col items-center justify-center text-center border border-slate-100 dark:border-slate-800 shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center mb-6 rounded-3xl shadow-sm">
          <span className="text-2xl">🚧</span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Sedang Diperbarui</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md">
          {message}
        </p>
      </div>
    </div>
  )
}
