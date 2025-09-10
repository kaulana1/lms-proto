'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage(){
  const [email,setEmail]=useState('teacher@example.com')
  const [password,setPassword]=useState('password123')
  const [loading,setLoading]=useState(false)
  const router = useRouter()
  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true)
    try{
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      })
      if(!res.ok){ toast.error('Login failed'); return }
      const { token } = await res.json()
      localStorage.setItem('token', token)
      toast.success('Signed in')
      router.push('/dashboard')
    } catch { toast.error('Network error') }
    finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 border rounded-xl p-6 bg-white shadow">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={(e)=>setEmail(e.currentTarget.value)} placeholder="Email" required />
        <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.currentTarget.value)} placeholder="Password" required />
        <button className="w-full rounded bg-black text-white py-2" disabled={loading}>{loading?'Signing in…':'Continue'}</button>
      </form>
    </div>
  )
}
