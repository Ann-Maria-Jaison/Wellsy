import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChallengesPage({ user, onChallengeUpdate }) {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeChallenge, setActiveChallenge] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const storedChallenges = localStorage.getItem('challenges');
      const storedUserChallenges = localStorage.getItem('userChallenges');
      const storedActiveChallenge = localStorage.getItem('activeChallenge');

      if (storedChallenges) setChallenges(JSON.parse(storedChallenges));
      if (storedUserChallenges) setUserChallenges(JSON.parse(storedUserChallenges));
      if (storedActiveChallenge) setActiveChallenge(JSON.parse(storedActiveChallenge));
    };

    loadFromLocalStorage();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('userChallenges', JSON.stringify(userChallenges));
    // Send updated challenges data to parent component or context
    if (onChallengeUpdate) {
      onChallengeUpdate(userChallenges);
    }
  }, [userChallenges, onChallengeUpdate]);

  useEffect(() => {
    localStorage.setItem('activeChallenge', JSON.stringify(activeChallenge));
  }, [activeChallenge]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // If no data in localStorage, fetch from API
        if (challenges.length === 0) {
          // Mock data if API is not available
          const mockChallenges = [
            {
              id: 1,
              title: "Daily Meditation",
              description: "Meditate for 10 minutes each day for a week",
              icon: "🧘",
              duration: 7,
              participants: 235
            },
            {
              id: 2,
              title: "Step Challenge",
              description: "Walk 10,000 steps daily for two weeks",
              icon: "👟",
              duration: 14,
              participants: 187
            },
            {
              id: 3,
              title: "Gratitude Journal",
              description: "Write down three things you're grateful for each day",
              icon: "📔",
              duration: 21,
              participants: 312
            },
            {
              id: 4,
              title: "Hydration Challenge",
              description: "Drink 8 glasses of water daily for a week",
              icon: "💧",
              duration: 7,
              participants: 175
            }
          ];
          
          setChallenges(mockChallenges);
          localStorage.setItem('challenges', JSON.stringify(mockChallenges));
        }
        
        // Load or initialize user challenges if needed
        if (userChallenges.length === 0) {
          const storedUserChallenges = localStorage.getItem('userChallenges');
          if (storedUserChallenges) {
            setUserChallenges(JSON.parse(storedUserChallenges));
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [challenges.length, userChallenges.length]);

  const handleStartChallenge = async (challengeId) => {
    try {
      // Find the challenge by ID
      const challenge = challenges.find(c => c.id === challengeId);
      
      if (!challenge) {
        throw new Error('Challenge not found');
      }
      
      // Create a new user challenge
      const newUserChallenge = {
        ...challenge,
        status: 'active',
        progress: 0,
        days_remaining: challenge.duration,
        started_at: new Date().toISOString()
      };
      
      // Update user challenges
      const updatedUserChallenges = [...userChallenges, newUserChallenge];
      setUserChallenges(updatedUserChallenges);
      setActiveChallenge(newUserChallenge);
      
      setMessage('Challenge started successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error starting challenge. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    try {
      // Find the challenge in userChallenges
      const updatedUserChallenges = userChallenges.map(challenge => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            status: 'completed',
            progress: 100,
            completed_at: new Date().toISOString()
          };
        }
        return challenge;
      });
      
      setUserChallenges(updatedUserChallenges);
      setActiveChallenge(null);
      
      setMessage('Challenge completed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error completing challenge. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveChallenge = async (challengeId) => {
    try {
      // Remove the challenge from userChallenges
      const updatedUserChallenges = userChallenges.filter(
        challenge => challenge.id !== challengeId
      );
      
      setUserChallenges(updatedUserChallenges);
      
      // If removing the active challenge, clear it
      if (activeChallenge && activeChallenge.id === challengeId) {
        setActiveChallenge(null);
      }
      
      setMessage('Challenge removed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error removing challenge. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const isChallengeJoined = (challengeId) => {
    return userChallenges.some(challenge => challenge.id === challengeId);
  };

  // Clear all local storage data
  const clearLocalStorage = () => {
    localStorage.removeItem('challenges');
    localStorage.removeItem('userChallenges');
    localStorage.removeItem('activeChallenge');
    setChallenges([]);
    setUserChallenges([]);
    setActiveChallenge(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Wellness Challenges</h1>
        <button
          onClick={clearLocalStorage}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear Local Data
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Active Challenge */}
      {activeChallenge && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Active Challenge</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 text-xl">{activeChallenge.icon}</span>
                </div>
                <h3 className="text-xl font-semibold">{activeChallenge.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{activeChallenge.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Progress: {activeChallenge.progress}%
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Days remaining: {activeChallenge.days_remaining}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleCompleteChallenge(activeChallenge.id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Complete Challenge
                </button>
                <button
                  onClick={() => handleRemoveChallenge(activeChallenge.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Remove Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Challenges */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Available Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map(challenge => (
            <div key={challenge.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-indigo-600 text-xl">{challenge.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{challenge.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Duration: {challenge.duration} days
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {challenge.participants} participants
                  </div>
                </div>

                {isChallengeJoined(challenge.id) ? (
                  <button
                    onClick={() => handleRemoveChallenge(challenge.id)}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remove Challenge
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartChallenge(challenge.id)}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={activeChallenge !== null}
                  >
                    {activeChallenge ? 'Complete Active Challenge First' : 'Start Challenge'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Challenges */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Completed Challenges</h2>
        {userChallenges.filter(challenge => challenge.status === 'completed').length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userChallenges
              .filter(challenge => challenge.status === 'completed')
              .map(challenge => (
                <div key={challenge.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-indigo-600 text-xl">{challenge.icon}</span>
                      </div>
                      <h3 className="text-xl font-semibold">{challenge.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed on: {new Date(challenge.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't completed any challenges yet.</p>
        )}
      </div>
    </div>
  );
}

export default ChallengesPage;