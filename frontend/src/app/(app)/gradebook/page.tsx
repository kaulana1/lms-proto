'use client'
import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/api'

type Row = { student:string; score?:number|null }

export default function Gradebook(){
  const [rows,setRows]=useState<Row[]>([])
  const [err,setErr]=useState<string|null>(null)

  useEffect(()=>{
    (async ()=>{
      try{
        const d = await authFetch('/demo/overview')
        const names = (d.students || ['Alex','Bri','Chris','Dev']).map((n:string)=>({
          student:n, score: Math.floor(70+Math.random()*30)
        }))
        setRows(names)
      }catch{ setErr('Could not load gradebook') }
    })()
  },[])

  if(err) return <div>{err}</div>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Gradebook</h1>
      <div className="overflow-x-auto rounded-md border bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2">Student</th>
              <th className="text-left px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} className="border-b last:border-0">
                <td className="px-4 py-2">{r.student}</td>
                <td className="px-4 py-2">{r.score ?? '—'}</td>
              </tr>
            ))}
            {rows.length===0 && <tr><td className="px-4 py-2" colSpan={2}>No data.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="opacity-60 text-sm">Prototype view — wire to real grading endpoints later.</p>
    </div>
  )
}
