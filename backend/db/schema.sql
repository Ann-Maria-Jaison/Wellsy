-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mood entries table
CREATE TABLE mood_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  mood_level INTEGER NOT NULL CHECK (mood_level BETWEEN 1 AND 5),
  stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Challenges table
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  total_days INTEGER NOT NULL,
  reward VARCHAR(255)
);

-- User challenges table
CREATE TABLE user_challenges (
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
CREATE TABLE resources (
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