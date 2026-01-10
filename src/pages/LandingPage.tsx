import { Link } from 'react-router-dom';
import { Dumbbell, Sparkles, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-12 px-8 text-center">
        <h1 className="text-5xl font-bold m-0">SmartFit AI - testing cicd deploy</h1>
        <p className="text-xl mt-2 opacity-95">AI-Powered Fitness Tracking & Personalized Training</p>
        
        <div className="mt-8 flex items-center justify-center space-x-4">
          <Link
            to="/register"
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition border-2 border-white"
          >
            Sign In
          </Link>
        </div>
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
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">Track Workouts</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-normal m-0">
              Log your training sessions and monitor your progress over time
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">AI Training Plans</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-normal m-0">
              Get personalized workout plans based on your goals and history
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">Share Progress</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-normal m-0">
              Connect with friends and share your fitness achievements
            </p>
          </div>
        </section>

        <section className="mt-16 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are achieving their fitness goals with AI-powered personalization
          </p>
          <Link
            to="/register"
            className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition inline-flex items-center space-x-2 text-lg"
          >
            <span>Start Free Today</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© 2025 SmartFit AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
