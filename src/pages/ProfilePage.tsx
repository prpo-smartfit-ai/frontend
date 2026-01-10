import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types';
import { User, Activity, Calendar, Target, ArrowLeft, Edit2, Check, X, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, fetchUserProfile, updateProfile: updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Edited profile state
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const profileData = await fetchUserProfile();
      setProfile(profileData);
      if (profileData) {
        setEditedProfile(profileData);
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccessMessage('');
    try {
      await updateAuthProfile(editedProfile);
      // Re-fetch the profile to make sure everything is in sync
      const profileData = await fetchUserProfile();
      setProfile(profileData);
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: (name === 'age' || name === 'height' || name === 'currentWeight' || name === 'preferredDaysPerWeek' || name === 'preferredSessionDuration') 
        ? (value === '' ? undefined : Number(value)) 
        : value
    }));
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SmartFit AI</h1>
          </div>
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
          <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage('')}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* basic info card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User className="h-6 w-6 text-purple-600 dark:text-purple-300 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition font-semibold"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProfile(profile || {});
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Email</p>
              <p className="font-semibold text-gray-900 dark:text-white">{profile?.email || user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    name="firstName"
                    value={editedProfile.firstName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="First"
                  />
                  <input
                    name="lastName"
                    value={editedProfile.lastName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Last"
                  />
                </div>
              ) : (
                <p className="font-semibold text-gray-900 dark:text-white">
                  {profile?.firstName || user?.firstName} {profile?.lastName || user?.lastName}
                </p>
              )}
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
                <p className="text-sm text-gray-600 dark:text-gray-300">Weight (kg)</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="currentWeight"
                    value={editedProfile.currentWeight || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {profile.currentWeight ? `${profile.currentWeight} kg` : 'Not set'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Height (cm)</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="height"
                    value={editedProfile.height || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {profile.height ? `${profile.height} cm` : 'Not set'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Age</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editedProfile.age || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.age || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Gender</p>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editedProfile.gender || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="" disabled>Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{profile.gender || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Fitness Level</p>
                {isEditing ? (
                  <select
                    name="fitnessLevel"
                    value={editedProfile.fitnessLevel || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="" disabled>Select</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{profile.fitnessLevel || 'Not set'}</p>
                )}
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
                {isEditing ? (
                  <select
                    name="primaryGoal"
                    value={editedProfile.primaryGoal || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="" disabled>Select</option>
                    <option value="WEIGHT_LOSS">Weight Loss</option>
                    <option value="MUSCLE_GAIN">Muscle Gain</option>
                    <option value="ENDURANCE">Endurance</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {profile.primaryGoal ? profile.primaryGoal.replace('_', ' ').toLowerCase() : 'Not set'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Preferred Days Per Week</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="preferredDaysPerWeek"
                    value={editedProfile.preferredDaysPerWeek || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.preferredDaysPerWeek || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Session Duration (min)</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="preferredSessionDuration"
                    value={editedProfile.preferredSessionDuration || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {profile.preferredSessionDuration ? `${profile.preferredSessionDuration} min` : 'Not set'}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Available Equipment</p>
                {isEditing ? (
                  <input
                    name="availableEquipment"
                    value={editedProfile.availableEquipment || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-white">{profile.availableEquipment || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* stats card */}
        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
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
