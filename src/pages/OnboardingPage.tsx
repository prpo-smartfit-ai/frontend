import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dumbbell, User, Activity, Target, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
    const { user, isAuthenticated, isLoading, fetchUserProfile, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        age: '',
        height: '',
        currentWeight: '',
        gender: '',
        fitnessLevel: '',
        primaryGoal: '',
        preferredDaysPerWeek: '',
        preferredSessionDuration: '',
    });
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            navigate('/login');
            return;
        }
        if (user) {
            const checkProfile = async () => {
                try {
                    const profile = await fetchUserProfile();
                    if (profile && profile.age && profile.height && profile.currentWeight) {
                        navigate('/home');
                    }
                } catch (error) {
                    // profile fetch failed, continue with onboarding
                } finally {
                    setProfileLoading(false);
                }
            };
            checkProfile();
        } else if (!isLoading) {
            setProfileLoading(false);
        }
    }, [user, isAuthenticated, isLoading, fetchUserProfile, navigate]);

    const steps = [
        {
            title: 'Basic Information',
            description: 'Tell us a bit about yourself',
            icon: User,
            fields: ['age', 'height', 'currentWeight', 'gender']
        },
        {
            title: 'Fitness Level',
            description: 'How would you describe your current fitness level?',
            icon: Activity,
            fields: ['fitnessLevel']
        },
        {
            title: 'Goals & Preferences',
            description: 'What are your fitness goals?',
            icon: Target,
            fields: ['primaryGoal', 'preferredDaysPerWeek', 'preferredSessionDuration']
        }
    ];

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = async () => {
        try {
            // turn form data into the right types for the api
            const profileData = {
                age: parseInt(formData.age),
                height: parseFloat(formData.height),
                currentWeight: parseFloat(formData.currentWeight),
                gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
                fitnessLevel: formData.fitnessLevel as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
                primaryGoal: formData.primaryGoal as 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'ENDURANCE' | 'MAINTENANCE',
                preferredDaysPerWeek: parseInt(formData.preferredDaysPerWeek),
                preferredSessionDuration: parseInt(formData.preferredSessionDuration),
            };

            await updateProfile(profileData);
            navigate('/home');
        } catch (error) {
            console.error('Failed to save profile:', error);
            navigate('/home');
        } finally {
            setProfileLoading(false);
        }
    };

    const canProceed = () => {
        const currentFields = steps[currentStep].fields;
        return currentFields.every(field => formData[field as keyof typeof formData].trim() !== '');
    };

    if (isLoading || profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center space-x-2">
                            <Dumbbell className="h-10 w-10 text-purple-600" />
                            <span className="text-2xl font-bold text-gray-800">SmartFit AI</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome, {user.firstName}!
                    </h2>
                    <p className="text-gray-600">
                        Let's personalize your experience
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="flex space-x-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${index <= currentStep ? 'bg-purple-600' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        {React.createElement(steps[currentStep].icon, { className: "h-6 w-6 text-purple-600 mr-3" })}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {steps[currentStep].title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {steps[currentStep].description}
                            </p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {currentStep === 0 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => handleChange('age', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                            placeholder="25"
                                            min="13"
                                            max="120"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Height (cm)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.height}
                                            onChange={(e) => handleChange('height', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                            placeholder="175.5"
                                            min="50"
                                            max="250"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.currentWeight}
                                        onChange={(e) => handleChange('currentWeight', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                        placeholder="70.5"
                                        min="20"
                                        max="300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gender
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleChange('gender', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {currentStep === 1 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fitness Level
                                </label>
                                <select
                                    value={formData.fitnessLevel}
                                    onChange={(e) => handleChange('fitnessLevel', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                >
                                    <option value="">Select your level</option>
                                    <option value="BEGINNER">Beginner - New to fitness</option>
                                    <option value="INTERMEDIATE">Intermediate - Some experience</option>
                                    <option value="ADVANCED">Advanced - Very experienced</option>
                                </select>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Primary Goal
                                    </label>
                                    <select
                                        value={formData.primaryGoal}
                                        onChange={(e) => handleChange('primaryGoal', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                    >
                                        <option value="">Select your goal</option>
                                        <option value="WEIGHT_LOSS">Weight Loss</option>
                                        <option value="MUSCLE_GAIN">Muscle Gain</option>
                                        <option value="ENDURANCE">Build Endurance</option>
                                        <option value="MAINTENANCE">Maintain Fitness</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Days per Week
                                        </label>
                                        <select
                                            value={formData.preferredDaysPerWeek}
                                            onChange={(e) => handleChange('preferredDaysPerWeek', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                        >
                                            <option value="">Select days</option>
                                            <option value="2">2 days</option>
                                            <option value="3">3 days</option>
                                            <option value="4">4 days</option>
                                            <option value="5">5 days</option>
                                            <option value="6">6 days</option>
                                            <option value="7">7 days</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Session Duration (min)
                                        </label>
                                        <select
                                            value={formData.preferredSessionDuration}
                                            onChange={(e) => handleChange('preferredSessionDuration', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                        >
                                            <option value="">Select duration</option>
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                            <option value="90">90 minutes</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="px-6 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed() || profileLoading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}