'use client'
import Link from 'next/link'

type Course = { id: string; title: string; section?: string }
const mock: Course[] = [
  { id: 'c1', title: 'Intro to Computer Science', section: 'Period 1' },
  { id: 'c2', title: 'Algebra I', section: 'Period 2' },
]

export default function Courses() {
  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <Link href="/join" className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50">
          Join course
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mock.map(c => (
          <Link key={c.id} href={`/courses/${c.id}`} className="rounded-xl border bg-white p-4 hover:shadow-sm">
            <div className="text-sm text-slate-500">{c.section ?? '—'}</div>
            <div className="font-medium">{c.title}</div>
          </Link>
        ))}
      </div>

      <p className="opacity-60 text-sm">Placeholder view — wire to real data later.</p>
    </main>
  )
}
