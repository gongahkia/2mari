import Dashboard from "../components/Dashboard"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">2mari 🎧</h1>
      <p className="mb-4">Real-time speech recognition that cuts out the fluff.</p>
      <p className="text-lg mb-4">Made by <a href="https://github.com/gongahkia/2mari">@gongahkia</a></p>
      <Dashboard />
    </main>
  )
}
