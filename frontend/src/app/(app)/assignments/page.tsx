'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { authFetch } from '@/lib/api'

type Assignment = { id: string; title: string; dueAt?: string | null }

export default function Assignments(){
  const [items,setItems]=useState<Assignment[]>([])
  const [err,setErr]=useState<string|null>(null)

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await authFetch('/demo/overview')
        setItems(data.assignments ?? [])
      }catch{ setErr('Could not load assignments') }
    })()
  },[])

  if(err) return <div>{err}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Assignments</h1>
      <ul className="space-y-2">
        {items.map(a=>(
          <li key={a.id} className="rounded-md border bg-white p-3">
            <Link href={`/assignments/${a.id}`} className="font-medium hover:underline">{a.title}</Link>
            {a.dueAt && <div className="text-sm text-slate-500">Due {new Date(a.dueAt).toLocaleDateString()}</div>}
          </li>
        ))}
        {items.length===0 && <li className="opacity-60">No assignments yet.</li>}
      </ul>
    </div>
  )
}
