'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  // Simple client-side guard for prototype
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem('token')) router.replace('/login')
  }, [router])

  function logout() {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <div className="font-semibold">K-12 LMS</div>
          <button
            onClick={logout}
            className="rounded px-3 py-1.5 border hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  )
}
