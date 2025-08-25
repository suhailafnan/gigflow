function App() {
  return (
    // This div centers everything on the page
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">

      {/* A visible title with Tailwind classes */}
      <h1 className="text-5xl font-bold text-cyan-400 mb-4">
        GigFlow Test Page
      </h1>

      {/* A paragraph to test text color and spacing */}
      <p className="text-lg text-gray-300 mb-8">
        If you can see this text styled, Tailwind is working!
      </p>

      {/* A button with background color, hover effects, and rounded corners */}
      <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
        Tailwind Button
      </button>

    </div>
  )
}

export default App
