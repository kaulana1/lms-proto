import { GraduationCap, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
        <span className="opacity-70">K–12 ready • Multi-tenant • AI search</span>
      </div>

      <h1 className="text-5xl font-extrabold tracking-tight">SGUSD LOG IN</h1>

      <p className="mt-4 max-w-3xl text-lg text-slate-600">
        Fast, secure access for the San Gabriel Unified School District.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Link
          href="/login?role=student"
          className="rounded-2xl border bg-white p-6 transition hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl border p-3">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-semibold">Student</div>
              <div className="text-slate-600">San Gabriel Unified Students</div>
            </div>
          </div>
        </Link>

        <Link
          href="/login?role=teacher"
          className="rounded-2xl border bg-white p-6 transition hover:shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl border p-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-semibold">Teacher</div>
              <div className="text-slate-600">San Gabriel Unified Teachers</div>
            </div>
          </div>
        </Link>
      </div>

      <p className="mt-10 text-sm text-slate-500">
        This is a demo welcome screen — sign in with the provided credentials to continue.
      </p>
    </main>
  )
}
