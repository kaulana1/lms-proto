'use client';
import { useEffect, useState } from 'react';
import KpiCards from '@/components/KpiCards';
export default function CourseKpiPage({ params }: { params: { courseId: string } }) {
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_API_URL!;
  useEffect(() => {
    const sid = localStorage.getItem('studentId') || '';
    fetch(`${API}/kpi/${params.courseId}?studentId=${sid}`, { credentials: 'include' })
      .then(r => r.json()).then(setKpi).finally(() => setLoading(false));
  }, [API, params.courseId]);
  if (loading) return <div className="p-6 text-gray-700">Loading…</div>;
  if (!kpi || kpi.error) return <div className="p-6 text-gray-700">No KPI data</div>;
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Your Progress</h1>
      <KpiCards kpi={kpi} />
    </main>
  );
}
