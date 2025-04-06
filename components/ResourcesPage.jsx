import React, { useState } from 'react';

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      id: 1,
      title: 'Counseling Services',
      description: '24/7 confidential counseling support for students',
      category: 'mental-health',
      contact: '555-0123',
      location: 'Student Center, Room 200',
      availability: '24/7',
      link: 'https://counseling.campus.edu',
      icon: '🧠'
    },
    {
      id: 2,
      title: 'Fitness Center',
      description: 'State-of-the-art fitness facilities and equipment',
      category: 'physical',
      location: 'Athletics Building',
      hours: '6:00 AM - 10:00 PM',
      schedule: 'https://fitness.campus.edu/schedule',
      icon: '💪'
    },
    {
      id: 3,
      title: 'Meditation Room',
      description: 'Quiet space for meditation and mindfulness',
      category: 'mental-health',
      location: 'Library, 3rd Floor',
      hours: '8:00 AM - 8:00 PM',
      reservation: 'https://meditation.campus.edu',
      icon: '🧘'
    },
    {
      id: 4,
      title: 'Nutrition Counseling',
      description: 'Professional nutrition advice and meal planning',
      category: 'physical',
      contact: '555-0124',
      location: 'Health Center',
      appointment: 'https://nutrition.campus.edu',
      icon: '🥗'
    },
    {
      id: 5,
      title: 'Student Support Groups',
      description: 'Peer support groups for various concerns',
      category: 'social',
      schedule: 'Weekly meetings',
      location: 'Student Center',
      registration: 'https://groups.campus.edu',
      icon: '👥'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: '📚' },
    { id: 'mental-health', name: 'Mental Health', icon: '🧠' },
    { id: 'physical', name: 'Physical Wellness', icon: '💪' },
    { id: 'social', name: 'Social Support', icon: '👥' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleResourceClick = (resource) => {
    // Open resource details in a modal or navigate to the resource page
    if (resource.link) {
      window.open(resource.link, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Campus Wellness Resources</h2>
        <p>Find support services and mental health resources available to you</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredResources.map(resource => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleResourceClick(resource)}
          >
            <div className="flex items-start">
              <div className="text-4xl mr-4">{resource.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{resource.title}</h3>
                <p className="text-gray-600 mt-1">{resource.description}</p>
                
                <div className="mt-4 space-y-2">
                  {resource.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {resource.location}
                    </div>
                  )}
                  
                  {resource.contact && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {resource.contact}
                    </div>
                  )}
                  
                  {(resource.hours || resource.availability) && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {resource.hours || resource.availability}
                    </div>
                  )}
                </div>

                {(resource.link || resource.appointment || resource.registration) && (
                  <button className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                    Learn More →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">24/7 Emergency Support</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                If you're experiencing a mental health emergency, call our 24/7 crisis hotline at{' '}
                <a href="tel:555-123-4567" className="font-medium underline">555-123-4567</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage; 