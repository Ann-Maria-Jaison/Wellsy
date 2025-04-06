import React from 'react';

const WeeklyMoodChart = ({ moodData }) => {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getMoodEmoji = (level) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😄'];
    return emojis[level - 1] || '😐';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Mood Trends</h3>
      <div className="h-48 flex items-end justify-between space-x-2">
        {moodData.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full">
              <div 
                className="bg-indigo-500 rounded-t-md w-full transition-all duration-300" 
                style={{height: `${value * 20}%`}}
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  {getMoodEmoji(value)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{dayLabels[index]}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Mood Legend</h4>
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="flex items-center">
              <span className="mr-1">{getMoodEmoji(level)}</span>
              <span className="text-xs text-gray-600">
                {level === 1 ? 'Very Bad' :
                 level === 2 ? 'Bad' :
                 level === 3 ? 'Neutral' :
                 level === 4 ? 'Good' : 'Excellent'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyMoodChart; 