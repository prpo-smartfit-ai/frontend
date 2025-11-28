import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../types';
import { User, Activity, Calendar, Target } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const profileData = await fetchUserProfile();
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SmartFit AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-200">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* basic info card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-purple-600 dark:text-purple-300 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
              <p className="font-semibold text-gray-900 dark:text-white">{profile?.email || user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {profile?.firstName || user?.firstName} {profile?.lastName || user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Member Since</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">User ID</p>
              <p className="font-semibold text-gray-900 dark:text-white">{profile?.id || user?.id}</p>
            </div>
          </div>
        </div>

        {/* physical stats card */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-300 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Physical Stats</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Weight</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {profile.currentWeight ? `${profile.currentWeight} kg` : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Height</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {profile.height ? `${profile.height} cm` : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Age</p>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.age || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Gender</p>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.gender || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fitness Level</p>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.fitnessLevel || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}

        {/* goals & preferences card */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-300 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Goals & Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Primary Goal</p>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.primaryGoal || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Preferred Days Per Week</p>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.preferredDaysPerWeek || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Session Duration</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {profile.preferredSessionDuration ? `${profile.preferredSessionDuration} min` : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Available Equipment</p>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.availableEquipment || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}

        {/* stats card */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-300 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Stats</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Workouts</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">{profile.totalWorkouts || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Hours</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                  {profile.totalHours ? profile.totalHours.toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
