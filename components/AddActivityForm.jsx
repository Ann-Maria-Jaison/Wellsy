import React, { useState } from 'react';

const AddActivityForm = ({ onSubmit, onClose }) => {
  const [activity, setActivity] = useState({
    name: '',
    hours: '',
    mood: 3,
    notes: ''
  }); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...activity,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Activity</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Name</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={activity.name}
              onChange={(e) => setActivity({ ...activity, name: e.target.value })}
              required
            >
              <option value="">Select an activity</option>
              <option value="Study">Study</option>
              <option value="Exercise">Exercise</option>
              <option value="Social">Social</option>
              <option value="Sleep">Sleep</option>
              <option value="Hobbies">Hobbies</option>
              <option value="Work">Work</option>
              <option value="Mindfulness">Mindfulness</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hours Spent</label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={activity.hours}
              onChange={(e) => setActivity({ ...activity, hours: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mood During Activity</label>
            <div className="flex space-x-4 mt-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setActivity({ ...activity, mood: level })}
                  className={`p-2 rounded-full ${activity.mood === level ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-gray-100'}`}
                >
                  {level === 1 ? '😢' : 
                   level === 2 ? '😕' : 
                   level === 3 ? '😐' : 
                   level === 4 ? '🙂' : '😄'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="3"
              value={activity.notes}
              onChange={(e) => setActivity({ ...activity, notes: e.target.value })}
              placeholder="Any additional notes about this activity..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Activity
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddActivityForm; 
