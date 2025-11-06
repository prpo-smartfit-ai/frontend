function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-12 px-8 text-center">
        <h1 className="text-5xl font-bold m-0">SmartFit AI</h1>
        <p className="text-xl mt-2 opacity-95">AI-Powered Fitness Tracking & Personalized Training</p>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto py-12 px-8">
        <section className="text-center mb-12">
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Track your workouts, monitor your progress, and receive personalized
            training recommendations powered by artificial intelligence.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">Track Workouts</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-normal m-0">Log your training sessions and monitor your progress over time</p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">AI Training Plans</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-normal m-0">Get personalized workout plans based on your goals and history</p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">Share Progress</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-normal m-0">Connect with friends and share your fitness achievements</p>
          </div>
        </section>
      </main>

    </div>
  )
}

export default App
