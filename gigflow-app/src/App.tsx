function App() {
  return (
    // Main container with a base gray color and a relative position for the gradient overlay
    <div className="relative min-h-screen bg-gray-800 text-gray-200 font-sans overflow-hidden">
      
      {/* Semi-transparent radial gradient overlay for a modern, textured look */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-900/0 to-gray-900/50"></div>
      
      {/* All content is placed in a relative container to sit on top of the background layers */}
      <div className="relative z-10">
        
        {/* Header Section */}
        <header className="border-b border-gray-700/50">
          <div className="container mx-auto flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold text-cyan-400">GigFlow</h1>
            <nav className="flex space-x-6 items-center">
              <a href="#" className="text-gray-300 hover:text-white transition">Browse Gigs</a>
              <a href="#" className="text-gray-300 hover:text-white transition">How it Works</a>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 border border-gray-500 rounded-lg shadow-md transition">
                Connect Wallet
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="container mx-auto text-center py-20 lg:py-32">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            The Future of Freelance is <span className="text-cyan-400">Decentralized.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Experience instant, secure, and trustless payments for your work. GigFlow leverages Avalanche to put you in control.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
              Find Work
            </button>
            <button className="bg-transparent border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all">
              Post a Gig
            </button>
          </div>
        </main>

        {/* Footer Section */}
        <footer className="absolute bottom-0 left-0 right-0 p-4">
          <div className="text-center text-gray-600 font-medium">
            <p>&copy; {new Date().getFullYear()} GigFlow. Built on Avalanche.</p>
          </div>
        </footer>
        
      </div>
    </div>
  )
}

export default App
