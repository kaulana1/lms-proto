type Props = { params:{id:string} }
export default function PageDetail({params}:Props){
  return (
    <main className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Page</h1>
      <div className="opacity-70">Page ID: {params.id}</div>
      <p className="opacity-60">Content coming soon.</p>
    </main>
  )
}
