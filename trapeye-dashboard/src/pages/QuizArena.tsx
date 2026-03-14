import { useState } from 'react';
import { quizData } from '../data/quizData';
import { useApp } from '../context/AppContext';

export default function QuizArena() {
  const { setQuizScore } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showScore, setShowScore] = useState(false);

  const question = quizData[currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    
    if (optionIndex === question.answer) {
      setScore(prev => prev + 1);
      setQuizScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion >= quizData.length - 1) {
      setShowScore(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowScore(false);
  };

  if (showScore) {
    const percentage = Math.round((score / quizData.length) * 100);
    const getMessage = () => {
      if (percentage < 40) return 'Keep learning! Review the glossary and try again.';
      if (percentage < 70) return 'Not bad! Focus on the topics you missed.';
      if (percentage < 90) return 'Great work! You\'re developing strong cyber awareness.';
      return "Exceptional! You're a CyberShield champion!";
    };

    return (
      <div className="page">
        <div className="topbar">
          <div className="page-title">Quiz <span>Arena</span></div>
        </div>

        <div className="quiz-container">
          <div className="score-panel show quiz-question">
            <div className="score-num">{score}/{quizData.length}</div>
            <div className="score-msg">{getMessage()}</div>
            <button className="quiz-restart" onClick={restartQuiz}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="topbar">
        <div className="page-title">Quiz <span>Arena</span></div>
      </div>

      <div className="quiz-container">
        <div className="quiz-progress">
          <div className="quiz-bar-wrap">
            <div 
              className="quiz-bar" 
              style={{ width: `${(currentQuestion / quizData.length) * 100}%` }}
            ></div>
          </div>
          <div className="quiz-count">Q {currentQuestion + 1} / {quizData.length}</div>
        </div>

        <div className={`quiz-layout ${answered ? 'with-explanation' : ''}`}>
          <div id="quizActive" className="quiz-main-content">
            <div className="quiz-question">
              <div className="quiz-q-num">QUESTION {String(currentQuestion + 1).padStart(2, '0')}</div>
              <div className="quiz-q-text">{question.question}</div>
              <div className="quiz-q-cat">{question.category}</div>
              <div className="quiz-options">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`quiz-option ${
                      answered && idx === question.answer ? 'correct' : ''
                    } ${
                      answered && idx === selectedAnswer && idx !== question.answer ? 'wrong' : ''
                    }`}
                    onClick={() => handleAnswer(idx)}
                    disabled={answered}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              className={`quiz-next-btn ${answered ? 'show' : ''}`} 
              onClick={nextQuestion}
            >
              Next Question
            </button>
          </div>

          {answered && (
            <div className="quiz-explanation-aside">
              <div className={`explanation-card ${selectedAnswer === question.answer ? 'correct' : 'wrong'}`}>
                <div className="explanation-header">
                  <div className="exp-icon">
                    {selectedAnswer === question.answer ? 'CORRECT' : 'WRONG'}
                  </div>
                  <div className="exp-title">
                    {selectedAnswer === question.answer ? 'Great Job!' : 'Better Luck Next Time'}
                  </div>
                </div>
                <div className="exp-label">EXPLANATION</div>
                <div className="exp-text">{question.explanation}</div>
                <div className="exp-footer">
                  <div className="exp-tag">#{question.category.replace(' ', '')}</div>
                  <div className="exp-tip">💡 Pro Tip: Read carefully before choosing.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
