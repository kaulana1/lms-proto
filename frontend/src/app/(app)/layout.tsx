'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, BookOpen, ClipboardList, Calendar, MessageSquare, TableProperties, LogOut } from 'lucide-react'

function getToken(){ if (typeof window==='undefined') return null; return localStorage.getItem('token') }
function getPayload(){
  const t = getToken()
  try { if(!t) return null; return JSON.parse(atob(t.split('.')[1])) } catch { return null }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [email,setEmail] = useState<string|undefined>()
  const [role,setRole] = useState<string|undefined>()

  useEffect(()=>{
    const p = getPayload()
    setEmail(p?.email); setRole(p?.role)
  },[])

  const isTeacher = role?.toUpperCase() === 'TEACHER'

  const nav = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/courses', label: 'Courses', icon: BookOpen },
    { href: '/assignments', label: 'Assignments', icon: ClipboardList },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    ...(isTeacher ? [{ href: '/gradebook', label: 'Gradebook', icon: TableProperties }] : []),
  ]

  function logout(){
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen grid grid-cols-12 bg-slate-50">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white">
        <div className="px-4 py-4 border-b flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">DynamicActive</span>
        </div>
        <nav className="p-2">
          {nav.map(item=>{
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm mb-1
                 ${active ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto p-3 text-xs text-slate-500 hidden md:block">
          <div className="rounded-lg border p-3 bg-slate-50">
            <div className="font-medium text-slate-700">{role ?? '—'}</div>
            <div className="truncate">{email ?? ''}</div>
          </div>
          <button onClick={logout}
            className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">
            <LogOut className="h-4 w-4"/> Log out
          </button>
        </div>
      </aside>

      <main className="col-span-12 md:col-span-9 lg:col-span-10">
        <header className="sticky top-0 z-10 bg-white border-b">
          <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold">K-12 LMS</h1>
            <div className="text-xs text-slate-500 md:hidden">{role} · {email}</div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}

