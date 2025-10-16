'use client'
import { useEffect, useState } from 'react'
import { authFetch } from '@/lib/api'
import { getCourseId } from '@/lib/course'

type Card = {
  id:string
  courseId:string
  kind:'WEAK_STANDARD'|'LATE_SUBMISSIONS'|'WORKLOAD_SPIKE'|string
  payload:any
  createdAt:string
  resolvedAt:string|null
}

export default function ActionCardsPage(){
  const [cards, setCards] = useState<Card[]>([])
  const [err, setErr] = useState<string|null>(null)
  const courseId = getCourseId()

  useEffect(()=>{
    (async ()=>{
      try{
        if(!courseId){ setErr('Missing courseId'); return }
        const j = await authFetch(`/action-cards?courseId=${courseId}`)
        setCards(j.cards || [])
      }catch(e:any){ setErr('Failed to load action cards') }
    })()
  },[courseId])

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Action Cards</h1>
      {err && <div className="text-red-600">{err}</div>}
      {(!err && cards.length===0) && <div>No cards yet.</div>}
      <div className="space-y-3">
        {cards.map(c=> <CardRow key={c.id} card={c}/>)}
      </div>
    </main>
  )
}

function CardRow({card}:{card:Card}){
  const subtitle =
    card.kind==='LATE_SUBMISSIONS' ? `${card.payload?.count} late — ${card.payload?.students?.join(', ') || ''}` :
    card.kind==='WEAK_STANDARD' ? `${card.payload?.standard} — ${card.payload?.recommendation}` :
    card.kind==='WORKLOAD_SPIKE' ? `${card.payload?.next7DaysDue} due in next 7 days — ${card.payload?.suggestion}` :
    JSON.stringify(card.payload)

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs uppercase opacity-60">{card.kind}</div>
      <div className="font-medium">{subtitle}</div>
      <div className="text-xs opacity-60 mt-1">Created {new Date(card.createdAt).toLocaleString()}</div>
    </div>
  )
}
