'use client'
import { useEffect, useState } from 'react'

export default function Dashboard(){
  const [data,setData] = useState<any>(null)
  const [error,setError] = useState<string|null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){ window.location.href = '/login'; return }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/demo/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async r => { if(!r.ok) throw new Error('API error'); return r.json() })
      .then(setData)
      .catch(() => setError('API not running yet — keep API on port 3001'))
  }, [])

  if(error) return <div className="p-6">{error}</div>
  if(!data) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{data.course.title}</h1>

      <section>
        <div className="text-sm text-gray-500">Section</div>
        <div className="font-medium">{data.section?.name ?? '—'}</div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Pages</h2>
        <ul className="list-disc ml-6">
          {data.pages.map((p:any) => <li key={p.id}>{p.title}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Assignments</h2>
        <ul className="list-disc ml-6">
          {data.assignments.map((a:any) => (
            <li key={a.id}>
              {a.title} — due {new Date(a.dueAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
