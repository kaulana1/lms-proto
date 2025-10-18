import ProgressBar from './ProgressBar';
type Kpi = { completion: number; assignmentsDone: number; assignmentsTotal: number; comprehension: number; compHit: number; compTot: number; practice: number; practiceDays7: number; };
export default function KpiCards({ kpi }: { kpi: Kpi }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border p-4">
        <div className="mb-2 font-medium text-gray-900">Assignments</div>
        <ProgressBar value={kpi.completion} label={`${kpi.assignmentsDone}/${kpi.assignmentsTotal} completed`} />
      </div>
      <div className="rounded-2xl border p-4">
        <div className="mb-2 font-medium text-gray-900">Comprehension</div>
        <ProgressBar value={kpi.comprehension} label={`${kpi.compHit}/${kpi.compTot} correct`} />
      </div>
      <div className="rounded-2xl border p-4">
        <div className="mb-2 font-medium text-gray-900">Practice (7d)</div>
        <ProgressBar value={kpi.practice} label={`${kpi.practiceDays7}/7 days`} />
      </div>
    </div>
  );
}
