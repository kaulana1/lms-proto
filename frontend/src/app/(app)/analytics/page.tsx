'use client'
import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/api'
import { getCourseId } from '@/lib/course'

type Overview = {
  completionRate:number
  lateRate:number
  avgScore:number
  strugglingCount:number
  counts:{ assignments:number; submissions:number; students:number }
}

export default function AnalyticsPage(){
  const [data, setData] = useState<Overview|null>(null)
  const [err, setErr] = useState<string|null>(null)
  const courseId = getCourseId()

  useEffect(()=>{
    (async ()=>{
      try{
        if(!courseId){ setErr('Missing courseId'); return }
        const j = await authFetch(`/analytics/overview?courseId=${courseId}`)
        setData(j)
      }catch(e:any){ setErr('Failed to load analytics') }
    })()
  },[courseId])

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      {err && <div className="text-red-600">{err}</div>}
      {!data && !err && <div>Loading…</div>}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat title="Completion" value={`${data.completionRate}%`} />
          <Stat title="Late rate" value={`${data.lateRate}%`} />
          <Stat title="Avg score" value={`${data.avgScore}`} />
          <Stat title="Struggling" value={`${data.strugglingCount}`} />
          <div className="md:col-span-4 grid grid-cols-3 gap-4">
            <Stat title="Assignments" value={`${data.counts.assignments}`} />
            <Stat title="Submissions" value={`${data.counts.submissions}`} />
            <Stat title="Students" value={`${data.counts.students}`} />
          </div>
        </div>
      )}
    </main>
  )
}

function Stat({title,value}:{title:string;value:string}){
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm opacity-60">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
