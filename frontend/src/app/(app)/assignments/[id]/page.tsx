'use client'
import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/api'

type Props = { params:{ id:string } }
type Assignment = { id:string; title:string; body?:string|null; dueAt?:string|null }

export default function AssignmentDetail({params}:Props){
  const [a,setA]=useState<Assignment|null>(null)
  const [err,setErr]=useState<string|null>(null)

  useEffect(()=>{
    (async ()=>{
      try{
        const d = await authFetch('/demo/overview')
        const found = (d.assignments||[]).find((x:any)=>x.id===params.id) || null
        setA(found)
      }catch{ setErr('Could not load assignment') }
    })()
  },[params.id])

  if(err) return <div>{err}</div>
  if(!a) return <div>Loading…</div>

  return (
    <article className="space-y-3">
      <h1 className="text-2xl font-semibold">{a.title}</h1>
      {a.dueAt && <div className="text-sm text-slate-500">Due {new Date(a.dueAt).toLocaleString()}</div>}
      <div className="prose max-w-none">{a.body ?? '—'}</div>
    </article>
  )
}
