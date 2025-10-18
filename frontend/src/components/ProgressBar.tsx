type Props = { value: number; label: string; srOnly?: boolean };
export default function ProgressBar({ value, label, srOnly }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-700">
        <span className={srOnly ? "sr-only" : ""}>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1 h-2 w-full bg-gray-200 rounded-2xl">
        <div
          className="h-2 rounded-2xl bg-green-600 transition-all"
          style={{ width: `${pct}%` }}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
}
