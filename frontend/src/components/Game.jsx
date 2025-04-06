import React, { useState } from 'react';

function Game() {
  const [currentGame, setCurrentGame] = useState(null);
  const [score, setScore] = useState(0);
  const [matchingPairs, setMatchingPairs] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [wordSearchGrid, setWordSearchGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const games = [
    {
      id: 1,
      title: 'Mood Match',
      description: 'Match the mood faces with their descriptions',
      icon: '😊',
      type: 'matching'
    },
    {
      id: 2,
      title: 'Stress Buster',
      description: 'Identify stress-relief activities',
      icon: '🧘',
      type: 'quiz'
    },
    {
      id: 3,
      title: 'Wellness Word Search',
      description: 'Find wellness-related words in the grid',
      icon: '🔍',
      type: 'wordsearch'
    }
  ];

  const moodPairs = [
    { emoji: '😊', description: 'Happy' },
    { emoji: '😢', description: 'Sad' },
    { emoji: '😡', description: 'Angry' },
    { emoji: '😴', description: 'Tired' },
    { emoji: '😰', description: 'Anxious' },
    { emoji: '😌', description: 'Calm' }
  ];

  const stressQuestions = [
    {
      question: 'Which activity helps reduce stress?',
      options: ['Deep breathing', 'Drinking coffee', 'Staying up late', 'Skipping meals'],
      correctAnswer: 'Deep breathing'
    },
    {
      question: 'What is a good way to manage stress?',
      options: ['Regular exercise', 'Avoiding sleep', 'Eating junk food', 'Isolating yourself'],
      correctAnswer: 'Regular exercise'
    },
    {
      question: 'Which practice promotes relaxation?',
      options: ['Meditation', 'Watching TV all day', 'Ignoring problems', 'Working non-stop'],
      correctAnswer: 'Meditation'
    }
  ];

  const wellnessWords = ['CALM', 'PEACE', 'HAPPY', 'RELAX', 'SLEEP', 'BREATHE', 'MEDITATE', 'EXERCISE'];
  const gridSize = 10;

  const startGame = (game) => {
    setCurrentGame(game);
    setScore(0);
    
    if (game.type === 'matching') {
      // Shuffle mood pairs
      const shuffledPairs = [...moodPairs].sort(() => Math.random() - 0.5);
      setMatchingPairs(shuffledPairs);
    } else if (game.type === 'quiz') {
      setQuizQuestions(stressQuestions);
      setCurrentQuestion(0);
    } else if (game.type === 'wordsearch') {
      generateWordSearch();
    }
  };

  const generateWordSearch = () => {
    // Create empty grid
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    
    // Place words
    wellnessWords.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.floor(Math.random() * 2); // 0: horizontal, 1: vertical
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        
        if (canPlaceWord(grid, word, row, col, direction)) {
          placeWord(grid, word, row, col, direction);
          placed = true;
        }
      }
    });
    
    // Fill remaining spaces with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    setWordSearchGrid(grid);
    setFoundWords([]);
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    if (direction === 0 && col + word.length > gridSize) return false;
    if (direction === 1 && row + word.length > gridSize) return false;
    
    for (let i = 0; i < word.length; i++) {
      const r = direction === 0 ? row : row + i;
      const c = direction === 0 ? col + i : col;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      const r = direction === 0 ? row : row + i;
      const c = direction === 0 ? col + i : col;
      grid[r][c] = word[i];
    }
  };

  const handleMatchingClick = (index) => {
    // Implement matching game logic
    const newPairs = [...matchingPairs];
    newPairs[index].matched = true;
    setMatchingPairs(newPairs);
    setScore(score + 10);
  };

  const handleQuizAnswer = (answer) => {
    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 20);
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endGame();
    }
  };

  const handleWordSearchClick = (row, col) => {
    // Implement word search selection logic
    // This is a simplified version - you might want to add more complex word finding logic
    const word = wordSearchGrid[row][col];
    if (word && !foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
      setScore(score + 15);
    }
  };

  const endGame = () => {
    setCurrentGame(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wellness Games</h1>

      {!currentGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map(game => (
            <div key={game.id} className="bg-white rounded-lg shadow p-6">
              <div className="text-4xl mb-4">{game.icon}</div>
              <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <button
                onClick={() => startGame(game)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Play Game
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{currentGame.title}</h2>
            <div className="text-xl font-bold text-indigo-600">Score: {score}</div>
          </div>

          {currentGame.type === 'matching' && (
            <div className="game-content">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {matchingPairs.map((pair, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg cursor-pointer ${
                      pair.matched ? 'bg-green-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleMatchingClick(index)}
                  >
                    <div className="text-4xl mb-2">{pair.emoji}</div>
                    <div className="text-center">{pair.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentGame.type === 'quiz' && (
            <div className="game-content">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {quizQuestions[currentQuestion].question}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(option)}
                      className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentGame.type === 'wordsearch' && (
            <div className="game-content">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Find these words:</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {wellnessWords.map((word, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded ${
                        foundWords.includes(word) ? 'bg-green-100' : 'bg-gray-100'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {wordSearchGrid.map((row, i) =>
                    row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="w-8 h-8 flex items-center justify-center border cursor-pointer hover:bg-gray-50"
                        onClick={() => handleWordSearchClick(i, j)}
                      >
                        {cell}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={endGame}
            className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Games
          </button>
        </div>
      )}
    </div>
  );
}

export default Game; 