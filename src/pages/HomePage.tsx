import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, Calendar, Zap, LogOut, Sparkles, AlertCircle, Check, X, Trash2 } from 'lucide-react';
import type { Workout } from '../types';
import { aiService } from '../api/aiService';
import { workoutService } from '../api/workoutService';

interface ExerciseWithTips {
  [key: string]: string;
}

interface WorkoutModalProps {
  workout: Workout;
  onClose: () => void;
  onFinish: (seconds: number, completedExerciseIds: string[]) => void;
  isFinishing: boolean;
}

function WorkoutModal({ workout, onClose, onFinish, isFinishing }: WorkoutModalProps) {
  const [exerciseTips, setExerciseTips] = useState<ExerciseWithTips>({});
  const [loadingTips, setLoadingTips] = useState<Set<string>>(new Set());
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [seconds, setSeconds] = useState(0);
  const { userProfile } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const loadExerciseTips = async (exerciseId: string, exerciseName: string) => {
    setLoadingTips(prev => new Set([...prev, exerciseId]));
    try {
      const tips = await aiService.getExerciseTips(
        exerciseName,
        userProfile?.fitnessLevel || 'intermediate'
      );
      setExerciseTips(prev => ({ ...prev, [exerciseId]: tips }));
    } catch (error) {
      console.error('Failed to load tips:', error);
      setExerciseTips(prev => ({ ...prev, [exerciseId]: 'Failed to load tips' }));
    } finally {
      setLoadingTips(prev => {
        const newSet = new Set(prev);
        newSet.delete(exerciseId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{workout.name}</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-purple-100">{workout.duration} minutes (Est.)</p>
              <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded text-sm font-mono">
                <Activity className="h-3.5 w-3.5" />
                {formatTime(seconds)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Exercises</h3>

        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exercise {index + 1}</p>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                    {exercise.name}
                  </h4>
                </div>
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    exercise.difficulty === 'beginner'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : exercise.difficulty === 'intermediate'
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}
                >
                  {exercise.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-purple-50 dark:bg-purple-900 rounded p-3">
                  <p className="text-gray-600 dark:text-gray-300 text-xs">Sets</p>
                  <p className="font-bold text-lg text-purple-600 dark:text-purple-300">{exercise.sets}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 rounded p-3">
                  <p className="text-gray-600 dark:text-gray-300 text-xs">Reps</p>
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-300">{exercise.reps}</p>
                </div>
              </div>

              {exercise.instructions && (
                <div className="bg-gray-50 dark:bg-gray-600 rounded p-4 mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Instructions: </span>
                    {exercise.instructions}
                  </p>
                </div>
              )}

              {exercise.equipment && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                  <span className="font-semibold">Equipment:</span> {exercise.equipment}
                </p>
              )}

              {/* AI Tips Section */}
              <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-700">
                {exerciseTips[exercise.id] ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">AI Tips</p>
                    </div>
                    <div className="text-sm text-blue-800 dark:text-blue-100 leading-relaxed whitespace-pre-line">
                      {exerciseTips[exercise.id].split('Common Mistake:').map((part, i) => (
                        i === 0 ? part.trim() : (
                          <div key={i} className="mt-2 p-2 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded">
                            <span className="font-bold">Common Mistake:</span> {part.trim()}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => loadExerciseTips(exercise.id, exercise.name)}
                    disabled={loadingTips.has(exercise.id)}
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 disabled:opacity-50"
                  >
                    {loadingTips.has(exercise.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        <span>Loading AI tips...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Get AI tips for this exercise</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input 
                  type="checkbox" 
                  id={`exercise-${exercise.id}`} 
                  className="w-4 h-4 dark:accent-purple-600"
                  checked={completedExercises.has(exercise.id)}
                  onChange={() => toggleExercise(exercise.id)}
                />
                <label htmlFor={`exercise-${exercise.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                  Mark as completed
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onFinish(seconds, Array.from(completedExercises))}
            disabled={isFinishing}
            className="flex-1 bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {isFinishing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Finishing...
              </span>
            ) : (
              'Finish Workout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user, userProfile, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState<string>('');
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
  const [motivationError, setMotivationError] = useState<string>('');
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  const [workoutsError, setWorkoutsError] = useState<string>('');
  const [generatingWeeks, setGeneratingWeeks] = useState<number | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<string>('');
  const [planError, setPlanError] = useState('');
  const [progressAnalysis, setProgressAnalysis] = useState<string>('');
  const [analyzingWeeks, setAnalyzingWeeks] = useState<number | null>(null);
  const [analysisError, setAnalysisError] = useState('');

  // Fetch workouts from service
  useEffect(() => {
    loadWorkouts();
  }, []);

  const generateWorkoutPlan = async (weeks: number) => {
    setGeneratingWeeks(weeks);
    setPlanError('');
    try {
      const plan = await aiService.generateWorkoutPlan(weeks, userProfile?.primaryGoal);
      // @ts-ignore - Backend returns description, frontend expects plan. Standardizing to data from backend.
      setWorkoutPlan(plan.description || plan.plan || "");
      // Re-load workouts as the new plan is saved to DB
      loadWorkouts();
    } catch (err) {
      setPlanError('Failed to generate workout plan');
      console.error('Plan generation error:', err);
    } finally {
      setGeneratingWeeks(null);
    }
  };

  const analyzeProgress = async (weeks: number) => {
    setAnalyzingWeeks(weeks);
    setAnalysisError('');
    try {
      const analysis = await aiService.analyzeProgress(weeks);
      setProgressAnalysis(analysis);
    } catch (err) {
      setAnalysisError('Failed to analyze progress');
      console.error('Analysis error:', err);
    } finally {
      setAnalyzingWeeks(null);
    }
  };

  const loadWorkouts = async () => {
    setIsLoadingWorkouts(true);
    setWorkoutsError('');
    try {
      const plans = await workoutService.getWorkoutPlans();
      // Map service response to frontend Workout type
      const mappedWorkouts: Workout[] = plans.map(plan => ({
        id: plan.id || '',
        name: plan.name,
        description: plan.description,
        duration: plan.duration || 60,
        difficulty: 'intermediate',
        focusAreas: [],
        exercises: plan.exercises || []
      }));
      setWorkouts(mappedWorkouts);
    } catch (error) {
      setWorkoutsError('Failed to load workouts');
      console.error('Workouts load error:', error);
      // Fallback to sample workouts if service fails
      setWorkouts(getSampleWorkouts());
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workout plan?')) {
      return;
    }

    try {
      await workoutService.deleteWorkoutPlan(id);
      setWorkouts(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Failed to delete workout:', error);
      alert('Failed to delete workout plan');
    }
  };

  const getSampleWorkouts = (): Workout[] => {
    return [
      {
        id: '1',
        name: 'Full Body Strength',
        description: 'Complete full body workout focusing on compound movements',
        duration: 60,
        difficulty: 'intermediate',
        focusAreas: ['chest', 'back', 'legs', 'arms'],
        exercises: [
          {
            id: '1',
            name: 'Barbell Squats',
            sets: 4,
            reps: '6-8',
            difficulty: 'intermediate',
            equipment: 'barbell',
            instructions: 'Keep chest up, descend until thighs parallel to ground'
          },
          {
            id: '2',
            name: 'Bench Press',
            sets: 4,
            reps: '6-8',
            difficulty: 'intermediate',
            equipment: 'barbell',
            instructions: 'Lower bar to chest, press back up explosively'
          },
          {
            id: '3',
            name: 'Deadlifts',
            sets: 3,
            reps: '5-6',
            difficulty: 'advanced',
            equipment: 'barbell',
            instructions: 'Keep bar close to body, drive through heels'
          }
        ]
      },
      {
        id: '2',
        name: 'Cardio & Core',
        description: 'HIIT cardio session with core strengthening',
        duration: 45,
        difficulty: 'intermediate',
        focusAreas: ['cardio', 'core'],
        exercises: [
          {
            id: '4',
            name: 'Jump Rope',
            sets: 5,
            duration: 60,
            reps: '60 seconds',
            difficulty: 'beginner',
            instructions: 'Keep wrists relaxed, land on balls of feet'
          },
          {
            id: '5',
            name: 'Plank',
            sets: 3,
            duration: 60,
            reps: '60 seconds',
            difficulty: 'beginner',
            instructions: 'Keep body straight, engage core'
          }
        ]
      },
      {
        id: '3',
        name: 'Upper Body Push',
        description: 'Focused push workout for chest, shoulders, and triceps',
        duration: 50,
        difficulty: 'beginner',
        focusAreas: ['chest', 'shoulders', 'triceps'],
        exercises: [
          {
            id: '6',
            name: 'Push-ups',
            sets: 3,
            reps: '10-15',
            difficulty: 'beginner',
            instructions: 'Keep body straight, lower until chest near ground'
          }
        ]
      }
    ];
  };

  const startWorkout = async (workout: Workout) => {
    try {
      const session = await workoutService.startSession(workout.id);
      setActiveSessionId(session.id);
      setSelectedWorkout(workout);
    } catch (err) {
      console.error('Failed to start session:', err);
      // Still open the modal so user can see exercises
      setSelectedWorkout(workout);
    }
  };

  const endWorkout = () => {
    setSelectedWorkout(null);
    setActiveSessionId(null);
  };

  const finishWorkout = async (actualSeconds: number, completedExerciseIds: string[]) => {
    if (!activeSessionId) {
      setSelectedWorkout(null);
      return;
    }

    setIsFinishing(true);
    try {
      // Log completed exercises first
      if (selectedWorkout) {
        for (const exId of completedExerciseIds) {
          const exercise = selectedWorkout.exercises.find(e => e.id === exId);
          if (exercise) {
            // Safe parse of reps string (e.g., "12" or "10-12" -> 12 or 10)
            const repsMatch = exercise.reps.match(/\d+/);
            const repsNum = repsMatch ? parseInt(repsMatch[0], 10) : 0;
            
            await workoutService.logExerciseCompletion(
              activeSessionId, 
              exId, 
              exercise.sets, 
              repsNum.toString(), // The service interface still says string, backend wants number?
              "Completed via workout session"
            );
          }
        }
      }

      await workoutService.endSession(activeSessionId, "Completed via Home Page");
      
      // Update stats in User Service
      if (userProfile && selectedWorkout) {
        const updatedWorkouts = (userProfile.totalWorkouts || 0) + 1;
        // Use actual time if it's significant (> 30s), else fallback to plan duration
        const sessionHours = actualSeconds > 30 ? actualSeconds / 3600 : selectedWorkout.duration / 60;
        const updatedHours = (userProfile.totalHours || 0) + sessionHours;
        
        await updateProfile({
          // @ts-ignore - Adding these fields to support dynamic stat updates
          totalWorkouts: updatedWorkouts,
          totalHours: Number(updatedHours.toFixed(2))
        });
      }

      setActiveSessionId(null);
      setSelectedWorkout(null);
    } catch (err) {
      console.error('Failed to finish workout:', err);
      alert('Failed to save workout session. Please try again.');
    } finally {
      setIsFinishing(false);
    }
  };

  const loadMotivationalMessage = async () => {
    setIsLoadingMotivation(true);
    setMotivationError('');
    try {
      const timeOfDay = new Date().getHours() < 12 ? 'morning' : (new Date().getHours() < 18 ? 'afternoon' : 'evening');
      const context = `User is checking their dashboard in the ${timeOfDay}. Goal: ${userProfile?.primaryGoal || 'general fitness'}. Status: They have ${workouts.length} workout plans ready to go.`;
      
      const message = await aiService.generateMotivationalMessage(context);
      setMotivationalMessage(message);
    } catch (error) {
      setMotivationError('Failed to load motivational message');
      console.error('Motivation load error:', error);
    } finally {
      setIsLoadingMotivation(false);
    }
  };

  useEffect(() => {
    loadMotivationalMessage();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.firstName}! 💪
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Let's crush your fitness goals today
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-600 dark:border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Workouts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {userProfile?.totalWorkouts || 0}
                </p>
              </div>
              <Activity className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-600 dark:border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Hours</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {userProfile?.totalHours || 0}
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-600 dark:border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Current Weight</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {userProfile?.currentWeight || '-'} kg
                </p>
              </div>
              <Zap className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-orange-600 dark:border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Fitness Level</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 capitalize">
                  {userProfile?.fitnessLevel?.toLowerCase() || '-'}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workouts List */}
          <div className="lg:col-span-2">
            {/* AI Progress Analysis Section */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl shadow-sm p-6 mb-8 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center mb-3">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-300 mr-2" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Progress Insights</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4 text-sm">
                Analyze your recent activity and get personalized fitness recommendations to stay on track.
              </p>

              {analysisError && (
                <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900 rounded border border-red-200 dark:border-red-700 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-200">{analysisError}</p>
                </div>
              )}

              {progressAnalysis && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-blue-100 dark:border-blue-800 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-200 uppercase tracking-wider">AI Analysis</p>
                    <button 
                      onClick={() => setProgressAnalysis('')}
                      className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {progressAnalysis}
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {[4, 8, 12].map(weeks => (
                  <button
                    key={weeks}
                    onClick={() => analyzeProgress(weeks)}
                    disabled={analyzingWeeks !== null}
                    className="flex-1 min-w-fit px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {analyzingWeeks === weeks ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Analyzing...
                      </span>
                    ) : (
                      `Analyze Last ${weeks} Weeks`
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Workout Plan Generator Section */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-xl shadow-sm p-6 mb-8 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center mb-3">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300 mr-2" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Personal Trainer</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-4 text-sm">
                Generate a custom plan based on your goals. New plans are automatically saved to your library.
              </p>

              {planError && (
                <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900 rounded border border-red-200 dark:border-red-700 mb-4">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-200">{planError}</p>
                </div>
              )}

              {workoutPlan && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="bg-green-100 dark:bg-green-800 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-800 dark:text-green-200 mb-1">Workout Plan Created!</p>
                    <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed italic line-clamp-2">
                      "{workoutPlan}"
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      The plan has been added to your library below.
                    </p>
                  </div>
                  <button 
                    onClick={() => setWorkoutPlan('')}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {[4, 8, 12].map(weeks => (
                  <button
                    key={weeks}
                    onClick={() => generateWorkoutPlan(weeks)}
                    disabled={generatingWeeks !== null}
                    className="flex-1 min-w-fit px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {generatingWeeks === weeks ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        Generating...
                      </span>
                    ) : (
                      `Generate ${weeks}-Week Plan`
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Workouts</h2>

              {isLoadingWorkouts && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Loading workouts...</p>
                  </div>
                </div>
              )}

              {workoutsError && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
                  <p className="font-semibold">Failed to load workouts</p>
                  <p className="text-sm mt-1">{workoutsError}</p>
                </div>
              )}

              {!isLoadingWorkouts && (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {workout.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {workout.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          workout.difficulty === 'beginner'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : workout.difficulty === 'intermediate'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}
                      >
                        {workout.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span>{workout.exercises.length} exercises</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {workout.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium capitalize"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startWorkout(workout)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Start Workout
                      </button>
                      <button
                        onClick={() => deleteWorkout(workout.id)}
                        className="px-3 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete workout plan"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 sticky top-4 space-y-4">
              {/* AI Motivation Section */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">AI Motivation</h3>
                </div>
                {motivationError && (
                  <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900 rounded border border-red-200 dark:border-red-700 mb-3">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 dark:text-red-200">{motivationError}</p>
                  </div>
                )}
                {isLoadingMotivation ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 italic leading-relaxed">
                      {motivationalMessage}
                    </p>
                    <button
                      onClick={loadMotivationalMessage}
                      className="w-full text-xs bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-2 px-3 rounded transition-colors"
                    >
                      Get Another Message
                    </button>
                  </>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Goals</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Primary Goal</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {userProfile?.primaryGoal?.toLowerCase().replace(/_/g, ' ') || '-'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preferred Frequency</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userProfile?.preferredDaysPerWeek} days/week
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Session Duration</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {userProfile?.preferredSessionDuration} minutes
                  </p>
                </div>
              </div>

              <button 
                onClick={() => navigate('/profile')}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-3">
                Edit Profile
              </button>
              <button 
                onClick={() => navigate('/history')}
                className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <WorkoutModal 
            workout={selectedWorkout} 
            onClose={endWorkout} 
            onFinish={finishWorkout}
            isFinishing={isFinishing}
          />
        </div>
      )}
    </div>
  );
}
