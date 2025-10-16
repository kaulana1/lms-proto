'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react'

export default function Welcome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold">DynamicActive LMS</span>
          </div>
          <Link href="/login" className="text-sm underline">Sign in</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-slate-600">
            <ShieldCheck className="h-4 w-4" /> K–12 ready • Multi-tenant • AI search
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Welcome to your modern K-12 learning hub
          </h1>
          <p className="max-w-2xl text-slate-600">
            Fast, simple, and secure. Teachers manage classes. Students see what’s next.
            AI-powered semantic search helps everyone find content instantly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full max-w-3xl">
            <RoleCard
              title="Student"
              subtitle="See today’s summary and lesson list"
              href="/login"
              icon={<GraduationCap className="h-5 w-5" />}
            />
            <RoleCard
              title="Teacher"
              subtitle="Review lesson plans and student progress"
              href="/login"
              icon={<BookOpen className="h-5 w-5" />}
            />
          </div>

          <p className="text-xs text-slate-500 mt-4">
            This is a demo welcome screen — sign in with the provided credentials to continue.
          </p>
        </motion.div>
      </section>
    </main>
  )
}

function RoleCard({ title, subtitle, href, icon }:{
  title:string; subtitle:string; href:string; icon:React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border bg-white p-6 text-left shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-slate-700 font-medium">
          <span className="rounded-lg border p-2 bg-slate-50">{icon}</span>
          {title}
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">→</span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </Link>
  )
}
