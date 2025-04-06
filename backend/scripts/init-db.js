const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 5),
  stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  total_days INTEGER NOT NULL,
  reward VARCHAR(255)
);

-- User challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  challenge_id INTEGER REFERENCES challenges(id),
  progress INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, challenge_id)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  contact VARCHAR(255),
  location VARCHAR(255),
  availability VARCHAR(255),
  link VARCHAR(255),
  icon VARCHAR(50)
);
`;

async function initDatabase() {
  try {
    console.log('Attempting to connect to the database...');
    await client.connect();
    console.log('Successfully connected to the database');

    console.log('Creating tables...');
    await client.query(schema);
    console.log('Database tables created successfully');
    
    // Insert some initial challenges
    const challenges = [
      {
        title: '7-Day Meditation Streak',
        description: 'Meditate for at least 10 minutes every day for 7 days',
        category: 'Mental Health',
        total_days: 7,
        reward: 'Meditation Master Badge'
      },
      {
        title: 'Gratitude Journal',
        description: "Write down 3 things you're grateful for each day this week",
        category: 'Mental Health',
        total_days: 7,
        reward: 'Gratitude Guru Badge'
      },
      {
        title: 'Exercise Challenge',
        description: 'Complete 30 minutes of exercise for 5 days this week',
        category: 'Physical Health',
        total_days: 5,
        reward: 'Fitness Warrior Badge'
      }
    ];

    console.log('Adding initial challenges...');
    for (const challenge of challenges) {
      await client.query(
        'INSERT INTO challenges (title, description, category, total_days, reward) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [challenge.title, challenge.description, challenge.category, challenge.total_days, challenge.reward]
      );
    }
    console.log('Initial challenges added');

    // Insert some initial resources
    const resources = [
      {
        title: 'Campus Counseling Center',
        description: 'Professional counseling services for students',
        category: 'Mental Health',
        contact: 'counseling@campus.edu',
        location: 'Student Services Building, Room 101',
        availability: 'Mon-Fri, 9am-5pm',
        link: 'https://campus.edu/counseling',
        icon: 'heart'
      },
      {
        title: 'Fitness Center',
        description: 'State-of-the-art gym facilities',
        category: 'Physical Health',
        contact: 'fitness@campus.edu',
        location: 'Recreation Center',
        availability: 'Mon-Sun, 6am-10pm',
        link: 'https://campus.edu/fitness',
        icon: 'dumbbell'
      },
      {
        title: 'Student Health Services',
        description: 'Medical care and health education',
        category: 'Physical Health',
        contact: 'health@campus.edu',
        location: 'Health Center',
        availability: 'Mon-Fri, 8am-6pm',
        link: 'https://campus.edu/health',
        icon: 'stethoscope'
      }
    ];

    console.log('Adding initial resources...');
    for (const resource of resources) {
      await client.query(
        'INSERT INTO resources (title, description, category, contact, location, availability, link, icon) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING',
        [resource.title, resource.description, resource.category, resource.contact, resource.location, resource.availability, resource.link, resource.icon]
      );
    }
    console.log('Initial resources added');

    console.log('Database initialization completed successfully');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

initDatabase(); 