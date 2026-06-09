export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Next.js
        </h1>
        <p className="text-lg text-gray-600 mb-8 bg-red-200">
          With Tailwind CSS and App Router
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition">
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}
