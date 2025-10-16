'use client'
import React, { useEffect, useState } from 'react'
import { RefreshCw, Search, TrendingUp, Wand2, PlusCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const token = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
const payload = () => {
  try {
    const t = token(); if (!t) return null;
    const b = atob(t.split('.')[1]); return JSON.parse(b)
  } catch { return null }
}
const isTeacher = (r?: string) => (r?.toUpperCase() === 'TEACHER')

type SearchResult = { id:string; kind:string; title:string; courseId?:string|null }
type Overview = { completionRate:number; lateRate:number; avgScore:number; counts:{pages:number;assignments:number;submissions:number;students:number} }
type CourseRef = { id:string|null; name:string|null }

export default function Dashboard(){
  const [course, setCourse] = useState<CourseRef|null>(null)
  const [data, setData] = useState<Overview|null>(null)
  const [error, setError] = useState<string|null>(null)
  const [q, setQ] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const role = payload()?.role

  useEffect(() => {
    const t = token()
    if(!t){ window.location.href = '/login'; return }
    ;(async () => {
      try{
        // get a default course, then load analytics overview
        const c = await fetch(`${API}/analytics/first-course`, { headers: { Authorization:`Bearer ${t}` } }).then(r=>r.json())
        setCourse(c)
        if(c?.id){
          const o = await fetch(`${API}/analytics/overview?courseId=${c.id}`, { headers:{ Authorization:`Bearer ${t}` } }).then(r=>r.json())
          setData(o)
        }else{
          setError('No course found in DB (seed?).')
        }
      }catch{ setError('API error. Is :3001 running?') }
    })()
  },[])

  async function doSearch(e?:React.FormEvent){
    e?.preventDefault()
    const t = token(); if(!t || !course?.id) return
    const query = q.trim(); if(query.length<2){ setResults([]); return }
    setSearching(true); setResults([])
    try{
      const r = await fetch(`${API}/ai/search?q=${encodeURIComponent(query)}&courseId=${course.id}`, {
        headers:{ Authorization:`Bearer ${t}` }
      })
      const j = await r.json(); setResults(j?.results ?? [])
    } finally { setSearching(false) }
  }

  async function reindex(){
    const t = token(); if(!t) return
    await fetch(`${API}/ai/reindex`, { method:'POST', headers:{ Authorization:`Bearer ${t}` } })
    alert('AI reindex kicked off (prototype).')
    if(q.trim()) doSearch()
  }

  if(error) return <div className="p-6">{error}</div>
  if(!data) return <div className="p-6">Loading…</div>

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{course?.name ?? 'Course'}</h2>
        {isTeacher(role) && (
          <button onClick={reindex} className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50">
            <RefreshCw className="h-4 w-4"/> Reindex AI
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isTeacher(role) ? (
          <>
            <QuickAction icon={<PlusCircle className="h-4 w-4" />} title="Create assignment" desc="Draft a new task" />
            <QuickAction icon={<TrendingUp className="h-4 w-4" />} title="Analytics" desc="Open insights" href="/analytics" />
            <QuickAction icon={<Wand2 className="h-4 w-4" />} title="Action Cards" desc="Suggested actions" href="/action-cards" />
          </>
        ) : (
          <>
            <QuickAction icon={<Wand2 className="h-4 w-4" />} title="Recommended" desc="See suggested pages" />
            <QuickAction icon={<TrendingUp className="h-4 w-4" />} title="Assignments" desc="What’s due next" href="/assignments" />
            <QuickAction icon={<PlusCircle className="h-4 w-4" />} title="Join course" desc="Coming soon" href="/join" />
          </>
        )}
      </div>

      <form onSubmit={doSearch} className="flex items-center gap-2">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-full rounded-md border bg-white pl-9 pr-3 py-2"
            placeholder="Search course pages (prototype)…"
            value={q} onChange={e=>setQ(e.currentTarget.value)}
          />
        </div>
        <button className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50" disabled={searching}>
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results.length>0 && (
        <section>
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          <ul className="list-disc ml-6">
            {results.map(r=> <li key={r.id}>{r.title} <span className="opacity-60 text-sm">({r.kind})</span></li>)}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-500">KPIs</div>
          <ul className="mt-2 space-y-1">
            <li>Completion: <b>{data.completionRate}%</b></li>
            <li>Late: <b>{data.lateRate}%</b></li>
            <li>Avg score: <b>{data.avgScore}</b></li>
          </ul>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-slate-500">Counts</div>
          <ul className="mt-2 space-y-1">
            <li>Pages: <b>{data.counts.pages}</b></li>
            <li>Assignments: <b>{data.counts.assignments}</b></li>
            <li>Submissions: <b>{data.counts.submissions}</b></li>
            <li>Students: <b>{data.counts.students}</b></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function QuickAction({icon,title,desc,href}:{icon:React.ReactNode;title:string;desc:string;href?:string}){
  const body = (
    <div className="rounded-xl border bg-white p-4 hover:bg-slate-50 transition">
      <div className="flex items-center gap-2">
        {icon}<div className="font-medium">{title}</div>
      </div>
      <div className="text-sm opacity-70 mt-1">{desc}</div>
    </div>
  )
  return href ? <a href={href}>{body}</a> : body
}
