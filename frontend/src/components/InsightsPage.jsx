import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InsightsPage({ user, userChallenges }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7'); // Default to 7 days

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/stats?period=${period}`);
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wellness Insights</h1>

      {/* Period Selector */}
      <div className="mb-8">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      {/* Mood Insights */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Mood Insights</h2>
        {stats?.mood_insights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Average Mood</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.mood_insights.average_mood.toFixed(1)}
              </p>
              <p className="text-gray-600 mt-2">
                {stats.mood_insights.mood_trend > 0 ? 'Improving' : 'Declining'} trend
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Stress Level</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.mood_insights.average_stress.toFixed(1)}
              </p>
              <p className="text-gray-600 mt-2">
                {stats.mood_insights.stress_trend > 0 ? 'Increasing' : 'Decreasing'} trend
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Mood Patterns</h3>
              <p className="text-gray-600">
                Most common mood: {stats.mood_insights.most_common_mood}
              </p>
              <p className="text-gray-600">
                Best day: {stats.mood_insights.best_day}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No mood data available for this period.</p>
        )}
      </div>

      {/* Activity Insights */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Activity Insights</h2>
        {stats?.activity_insights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Total Hours</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.activity_insights.total_hours}
              </p>
              <p className="text-gray-600 mt-2">
                {stats.activity_insights.activity_trend > 0 ? 'Increasing' : 'Decreasing'} activity
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Most Active Day</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {stats.activity_insights.most_active_day}
              </p>
              <p className="text-gray-600 mt-2">
                {stats.activity_insights.most_active_hours} hours
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Activity Impact</h3>
              <p className="text-gray-600">
                Best mood during: {stats.activity_insights.best_mood_activity}
              </p>
              <p className="text-gray-600">
                Average mood boost: {stats.activity_insights.mood_boost.toFixed(1)} points
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No activity data available for this period.</p>
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats?.recommendations?.map((recommendation, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">{recommendation.title}</h3>
              <p className="text-gray-600">{recommendation.description}</p>
              {recommendation.action && (
                <button
                  onClick={() => window.location.href = recommendation.action_url}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {recommendation.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InsightsPage;