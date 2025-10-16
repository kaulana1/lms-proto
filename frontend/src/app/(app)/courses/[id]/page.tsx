type Props = { params: { id: string } }

export default function CourseDetail({ params }: Props) {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Course</h1>
      <p className="opacity-70">Course ID: {params.id}</p>
      <p className="opacity-60">Detail page placeholder.</p>
    </main>
  )
}
