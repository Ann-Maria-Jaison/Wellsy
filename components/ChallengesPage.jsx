import React, { useState } from 'react';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: '7-Day Meditation Streak',
      description: 'Meditate for at least 5 minutes every day for 7 days.',
      category: 'mindfulness',
      progress: 5,
      total: 7,
      status: 'active',
      reward: '🧘 Meditation Pro Badge',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: 'Gratitude Journal',
      description: "Write down 3 things you're grateful for each day this week.",
      category: 'mental',
      progress: 2,
      total: 7,
      status: 'active',
      reward: '📝 Journal Keeper Badge',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: 'Exercise Challenge',
      description: 'Get at least 30 minutes of physical activity for 5 days.',
      category: 'physical',
      progress: 3,
      total: 5,
      status: 'active',
      reward: '🏃 Exercise Master Badge',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const handleProgressUpdate = (challengeId) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId && challenge.progress < challenge.total) {
        const newProgress = challenge.progress + 1;
        return {
          ...challenge,
          progress: newProgress,
          status: newProgress === challenge.total ? 'completed' : 'active'
        };
      }
      return challenge;
    }));
  };

  const handleJoinChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setShowJoinModal(true);
  };

  const confirmJoinChallenge = () => {
    setChallenges([
      ...challenges,
      {
        ...selectedChallenge,
        id: Date.now(),
        progress: 0,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]);
    setShowJoinModal(false);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'mindfulness':
        return 'green';
      case 'mental':
        return 'blue';
      case 'physical':
        return 'amber';
      default:
        return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Wellness Challenges</h2>
        <p>Complete challenges to earn badges and improve your wellbeing!</p>
      </div>

      {/* Active Challenges */}
      <div className="grid md:grid-cols-2 gap-6">
        {challenges.filter(c => c.status === 'active').map(challenge => (
          <div
            key={challenge.id}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${getCategoryColor(challenge.category)}-500`}
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>
              <span className={`bg-${getCategoryColor(challenge.category)}-100 text-${getCategoryColor(challenge.category)}-800 text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                Active
              </span>
            </div>
            <p className="text-gray-600 mt-2">{challenge.description}</p>
            <div className="mt-4 flex space-x-2">
              {Array.from({ length: challenge.total }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full ${
                    idx < challenge.progress
                      ? `bg-${getCategoryColor(challenge.category)}-500`
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            <div className="mt-2 text-right text-sm text-gray-600">
              {challenge.progress}/{challenge.total} days
            </div>
            <button
              onClick={() => handleProgressUpdate(challenge.id)}
              className={`mt-4 w-full bg-${getCategoryColor(challenge.category)}-600 text-white px-4 py-2 rounded-md hover:bg-${getCategoryColor(challenge.category)}-700`}
              disabled={challenge.progress === challenge.total}
            >
              Complete Today's Task
            </button>
          </div>
        ))}
      </div>

      {/* Available Challenges */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Challenges</h3>
        <div className="space-y-4">
          {[
            {
              id: 'digital-detox',
              title: 'Digital Detox',
              description: 'Limit screen time to 2 hours a day (excluding study time) for one week.',
              category: 'mental',
              total: 7,
              reward: '📱 Digital Wellness Badge'
            },
            {
              id: 'sleep-schedule',
              title: 'Healthy Sleep Schedule',
              description: 'Maintain a consistent sleep schedule for 5 days.',
              category: 'physical',
              total: 5,
              reward: '😴 Sleep Master Badge'
            }
          ].map(challenge => (
            <div key={challenge.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                  <p className="text-sm text-gray-500 mt-2">Reward: {challenge.reward}</p>
                </div>
                <button
                  onClick={() => handleJoinChallenge(challenge)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Join Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Challenge Modal */}
      {showJoinModal && selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Join Challenge</h3>
            <p className="text-gray-600 mb-4">
              Are you ready to start the "{selectedChallenge.title}" challenge? You'll need to:
            </p>
            <ul className="list-disc list-inside mb-4 text-gray-600">
              <li>Complete daily tasks for {selectedChallenge.total} days</li>
              <li>Track your progress regularly</li>
              <li>Stay committed to earn your badge</li>
            </ul>
            <div className="flex space-x-3">
              <button
                onClick={confirmJoinChallenge}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Start Challenge
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesPage; 