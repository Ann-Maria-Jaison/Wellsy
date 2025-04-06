import React from 'react';

const InsightsPage = ({ weeklyMoodData, activities, challenges }) => {
  const calculateAverageMood = () => {
    const sum = weeklyMoodData.reduce((acc, val) => acc + val, 0);
    return (sum / weeklyMoodData.length).toFixed(1);
  };

  const getMostFrequentActivity = () => {
    const activityCounts = activities.reduce((acc, activity) => {
      acc[activity.name] = (acc[activity.name] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No activities';
  };

  const generateReport = () => {
    const report = {
      weeklyMoodData,
      activities,
      challenges,
      averageMood: calculateAverageMood(),
      mostFrequentActivity: getMostFrequentActivity(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellness-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Your Wellness Insights</h2>
        <p>Analyze your wellness journey and track your progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Mood</h3>
          <div className="text-3xl font-bold text-indigo-600">{calculateAverageMood()}</div>
          <p className="text-sm text-gray-600 mt-2">Based on your weekly mood entries</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Most Frequent Activity</h3>
          <div className="text-3xl font-bold text-indigo-600">{getMostFrequentActivity()}</div>
          <p className="text-sm text-gray-600 mt-2">Your most common wellness activity</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Challenges</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {challenges.filter(c => !c.completed).length}
          </div>
          <p className="text-sm text-gray-600 mt-2">Ongoing wellness challenges</p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Impact Analysis</h3>
        <div className="space-y-4">
          {Object.entries(
            activities.reduce((acc, activity) => {
              if (!acc[activity.name]) {
                acc[activity.name] = { totalMood: 0, count: 0 };
              }
              acc[activity.name].totalMood += activity.mood;
              acc[activity.name].count += 1;
              return acc;
            }, {})
          ).map(([activity, data]) => (
            <div key={activity} className="flex items-center">
              <div className="w-32 font-medium">{activity}</div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${(data.totalMood / (data.count * 5)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-20 text-right text-sm text-gray-600">
                {(data.totalMood / data.count).toFixed(1)} avg
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Report */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Download Reports</h3>
        <div className="space-y-4">
          <button
            onClick={generateReport}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Full Report
          </button>
          <p className="text-sm text-gray-600 text-center">
            Download a comprehensive report of your wellness journey, including mood trends, activities, and achievements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage; 