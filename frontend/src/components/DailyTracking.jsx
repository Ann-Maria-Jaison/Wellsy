import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DailyTracking({ user }) {
  const [moodLevel, setMoodLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    hours: '',
    mood: 5,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activities');
        setActivities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleMoodSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/mood', {
        mood_level: moodLevel,
        stress_level: stressLevel,
        notes
      });
      setMessage('Mood entry saved successfully!');
      setNotes('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving mood entry. Please try again.');
    }
  };

  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/activities', {
        name: newActivity.name,
        hours: parseFloat(newActivity.hours),
        mood: newActivity.mood,
        notes: newActivity.notes
      });
      setActivities([response.data, ...activities]);
      setNewActivity({
        name: '',
        hours: '',
        mood: 5,
        notes: ''
      });
      setMessage('Activity added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding activity. Please try again.');
    }
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
      <h1 className="text-3xl font-bold mb-8">Daily Tracking</h1>

      {message && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {/* Mood Tracking Form */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Track Your Mood</h2>
          <form onSubmit={handleMoodSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Mood Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodLevel}
                onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 (Very Low)</span>
                <span>10 (Very High)</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Stress Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 (Very Low)</span>
                <span>10 (Very High)</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                placeholder="How are you feeling today?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Mood Entry
            </button>
          </form>
        </div>
      </div>

      {/* Activity Tracking Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Track Your Activities</h2>
          <form onSubmit={handleActivitySubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Activity Name</label>
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={newActivity.hours}
                  onChange={(e) => setNewActivity({ ...newActivity, hours: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Mood During Activity (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newActivity.mood}
                onChange={(e) => setNewActivity({ ...newActivity, mood: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1 (Very Low)</span>
                <span>10 (Very High)</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Notes</label>
              <textarea
                value={newActivity.notes}
                onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="2"
                placeholder="Any notes about the activity?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Activity
            </button>
          </form>

          {/* Activity List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Today's Activities</h3>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="border-b pb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{activity.name}</span>
                      <span className="text-gray-600">{activity.hours} hours</span>
                    </div>
                    {activity.notes && (
                      <p className="text-gray-600 mt-2">{activity.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No activities recorded today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyTracking; 