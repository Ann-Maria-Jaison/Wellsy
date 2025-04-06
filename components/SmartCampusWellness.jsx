import React, { useState, useEffect } from 'react';
import WeeklyMoodChart from './WeeklyMoodChart';
import AddActivityForm from './AddActivityForm';
import InsightsPage from './InsightsPage';
import ResourcesPage from './ResourcesPage';
import ChallengesPage from './ChallengesPage';

const SmartCampusWellness = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [mood, setMood] = useState(3);
  const [stressLevel, setStressLevel] = useState(2);
  const [streak, setStreak] = useState(5);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [activities, setActivities] = useState([
    { id: 1, name: 'Study', hours: 6, mood: 2 },
    { id: 2, name: 'Exercise', hours: 1, mood: 4 },
    { id: 3, name: 'Social Time', hours: 2, mood: 5 },
    { id: 4, name: 'Sleep', hours: 7, mood: 3 }
  ]);
  
  const [weeklyMoodData, setWeeklyMoodData] = useState([3, 4, 2, 3, 5, 4, 3]);
  const [dailyEntry, setDailyEntry] = useState({
    mood,
    stressLevel,
    activities: [],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Helper function to generate mood emoji
  const getMoodEmoji = (level) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    return emojis[level - 1] || '😐';
  };

  const handleAddActivity = (newActivity) => {
    setActivities([...activities, newActivity]);
    setDailyEntry({
      ...dailyEntry,
      activities: [...dailyEntry.activities, newActivity]
    });
  };

  const handleSubmitDailyEntry = () => {
    // Update weekly mood data
    const newWeeklyMoodData = [...weeklyMoodData];
    const today = new Date().getDay();
    newWeeklyMoodData[today === 0 ? 6 : today - 1] = mood;
    setWeeklyMoodData(newWeeklyMoodData);

    // Reset daily entry
    setDailyEntry({
      mood,
      stressLevel,
      activities: [],
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });

    // Update streak
    setStreak(streak + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Smart Campus Wellness</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-500 px-3 py-1 rounded-full">
              <span className="font-semibold">Streak: {streak} days 🔥</span>
            </div>
            <div className="bg-white text-indigo-600 rounded-full h-10 w-10 flex items-center justify-center">
              <span className="font-bold">JS</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex space-x-1">
          <button 
            onClick={() => setActivePage('dashboard')}
            className={`py-4 px-6 font-medium ${activePage === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActivePage('tracking')}
            className={`py-4 px-6 font-medium ${activePage === 'tracking' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            Daily Tracking
          </button>
          <button 
            onClick={() => setActivePage('insights')}
            className={`py-4 px-6 font-medium ${activePage === 'insights' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            Insights
          </button>
          <button 
            onClick={() => setActivePage('challenges')}
            className={`py-4 px-6 font-medium ${activePage === 'challenges' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            Challenges
          </button>
          <button 
            onClick={() => setActivePage('resources')}
            className={`py-4 px-6 font-medium ${activePage === 'resources' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
          >
            Resources
          </button>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        {activePage === 'dashboard' && (
          <div className="space-y-6">
            {/* Greeting and Quick Mood */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Good afternoon, Jordan!</h2>
                  <p className="text-gray-600">How are you feeling today?</p>
                </div>
                <div className="bg-indigo-100 p-4 rounded-full">
                  <span className="text-4xl">{getMoodEmoji(mood)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Set today's mood:</span>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button 
                        key={level}
                        onClick={() => {
                          setMood(level);
                          setDailyEntry({ ...dailyEntry, mood: level });
                        }}
                        className={`text-2xl p-2 rounded-full ${mood === level ? 'bg-indigo-100' : ''}`}
                      >
                        {getMoodEmoji(level)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Weekly Mood Chart */}
            <WeeklyMoodChart moodData={weeklyMoodData} />
            
            {/* Activities Tracking */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Daily Activities</h3>
                <button
                  onClick={() => setShowAddActivity(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add New Activity
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Activity</th>
                      <th className="text-left py-2">Hours</th>
                      <th className="text-left py-2">Mood</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(activity => (
                      <tr key={activity.id} className="border-b">
                        <td className="py-3">{activity.name}</td>
                        <td className="py-3">{activity.hours}</td>
                        <td className="py-3">{getMoodEmoji(activity.mood)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {activePage === 'tracking' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Wellness Tracking</h2>
            
            {/* Mood and Stress Tracking */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Today's Mood</h3>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button 
                      key={level}
                      onClick={() => {
                        setMood(level);
                        setDailyEntry({ ...dailyEntry, mood: level });
                      }}
                      className={`flex flex-col items-center p-4 rounded-lg ${mood === level ? 'bg-indigo-100 border border-indigo-300' : 'bg-gray-50'}`}
                    >
                      <span className="text-3xl mb-2">{getMoodEmoji(level)}</span>
                      <span className="text-sm text-gray-600">
                        {level === 1 ? 'Very Bad' : 
                         level === 2 ? 'Bad' : 
                         level === 3 ? 'Neutral' : 
                         level === 4 ? 'Good' : 'Excellent'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Stress Level</h3>
                <div className="flex space-x-4">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button 
                      key={level}
                      onClick={() => {
                        setStressLevel(level);
                        setDailyEntry({ ...dailyEntry, stressLevel: level });
                      }}
                      className={`flex flex-col items-center p-4 rounded-lg ${stressLevel === level ? 'bg-indigo-100 border border-indigo-300' : 'bg-gray-50'}`}
                    >
                      <span className="text-3xl mb-2">
                        {level === 1 ? '😌' : 
                         level === 2 ? '😊' : 
                         level === 3 ? '😐' : 
                         level === 4 ? '😣' : '😫'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {level === 1 ? 'None' : 
                         level === 2 ? 'Mild' : 
                         level === 3 ? 'Moderate' : 
                         level === 4 ? 'High' : 'Severe'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Journal Entry</h3>
                <textarea 
                  className="w-full border rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-300" 
                  placeholder="How are you feeling today? What's on your mind?"
                  value={dailyEntry.notes}
                  onChange={(e) => setDailyEntry({ ...dailyEntry, notes: e.target.value })}
                ></textarea>
              </div>
              
              <button
                onClick={handleSubmitDailyEntry}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700"
              >
                Submit Today's Entry
              </button>
            </div>
          </div>
        )}
        
        {activePage === 'insights' && <InsightsPage weeklyMoodData={weeklyMoodData} activities={activities} challenges={[]} />}
        {activePage === 'challenges' && <ChallengesPage />}
        {activePage === 'resources' && <ResourcesPage />}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          <p>© 2025 Smart Campus Wellness Monitor | Emergency Help: Call Campus Support at 555-123-4567</p>
        </div>
      </footer>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <AddActivityForm
          onSubmit={handleAddActivity}
          onClose={() => setShowAddActivity(false)}
        />
      )}
    </div>
  );
};

export default SmartCampusWellness; 