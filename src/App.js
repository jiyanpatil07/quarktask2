

import React, { useState, useEffect } from "react";
import "./App.css";
import { questions } from "./questions";

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [unanswered, setUnanswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [userName, setUserName] = useState("");
  const [showUserName, setShowUserName] = useState(true);
  const [totalTimeLeft, setTotalTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    let timer;
    if (currentQuestion < questions.length && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (currentQuestion < questions.length && timeLeft === 0) {
      setUnanswered(unanswered + 1);
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(25);
    } else {
      setShowScore(true);
    }
    return () => clearTimeout(timer);
  }, [currentQuestion, timeLeft]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeLeft(totalTimeLeft - 1);
    }, 1000);
    if (totalTimeLeft === 0) {
      setShowScore(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [totalTimeLeft]);

  const handleClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnswered(answered + 1);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(25);
    } else {
      setShowScore(true);
    }
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleStartTest = () => {
    setShowUserName(false);
  };

  return (
    <div className="app">
      {showScore ? (
        <section className="showScore-section">
          <h2>{userName}, your score is {score} out of {questions.length}</h2>
          <p>
            You answered {answered} out of {questions.length} questions.
          </p>
          <p>You left {unanswered} questions unanswered.</p>
        </section>
      ) : (
        <>
          <section className="question-section">
            {showUserName && (
              <label>
                User Name:
                <input type="text" value={userName} onChange={handleUserNameChange} />
              </label>
            )}
            {showUserName ? (
              <button onClick={handleStartTest}>Start Test</button>
            ) : (
              <>
                <h1>
                  Question {currentQuestion + 1}/{questions.length}
                </h1>
                <p>{questions[currentQuestion].questionText}</p>
                <p>Time Left: {timeLeft} seconds</p>
                <p>Welcome, {userName}!</p>
              </>
            )}
          </section>

          <section className="answer-section">
            {!showUserName && questions[currentQuestion].answerOptions.map((item) => (
              <button key={item.answerText} onClick={() => handleClick(item.isCorrect)}>
                {item.answerText}
              </button>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
