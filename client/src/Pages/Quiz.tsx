
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyperlinks Text Mark Language",
      "Home Tool Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which CSS property is used to change text color?",
    options: [
      "font-style",
      "background-color",
      "color",
      "text-decoration"
    ],
    answer: 2
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: [
      "int",
      "var",
      "string",
      "define"
    ],
    answer: 1
  },
  {
    question: "Which method is used to select an element by its ID in JavaScript?",
    options: [
      "getElementById()",
      "getElementByClass()",
      "queryById()",
      "selectElement()"
    ],
    answer: 0
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    options: [
      "<link>",
      "<href>",
      "<a>",
      "<url>"
    ],
    answer: 2
  }
];

export default function Quiz() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");

  const question = questions[current];

  const selectAnswer = (index: number) => {
    const updated = [...selected];
    updated[current] = index;
    setSelected(updated);
    setError("");
  };

  const submitQuiz = () => {
    if (selected.length !== 5 || selected.some(a => a === undefined)) {
      setError("Please answer all 5 questions before submitting.");
      return;
    }

    const score = questions.reduce(
      (total, q, i) => total + (selected[i] === q.answer ? 1 : 0),
      0
    );

    localStorage.setItem(
      "quizResult",
      JSON.stringify({
        score,
        total: questions.length,
        answers: selected,
        questions
      })
    );

    navigate("/result");
  };

  return (
    <div className="quiz-page">
      <div className="quiz-card">

        <div className="quiz-header">
          <div>
            <h1>QuizMaster</h1>
            <p>Advanced Web Technology</p>
          </div>
          <span className="quiz-tag">AWT Quiz</span>
        </div>

        <div className="progress-info">
          <span>Question {current + 1} of 5</span>
          <span>{Math.round(((current + 1) / 5) * 100)}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((current + 1) / 5) * 100}%` }}
          />
        </div>

        <div className="question-section">
          <h2>{question.question}</h2>

          <div className="options-list">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`option ${
                  selected[current] === index ? "selected" : ""
                }`}
                onClick={() => selectAnswer(index)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="quiz-footer">
          <button
            className="previous-btn"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Previous
          </button>

          {current === 4 ? (
            <button className="next-btn" onClick={submitQuiz}>
              Submit Quiz
            </button>
          ) : (
            <button
              className="next-btn"
              onClick={() => {
                if (selected[current] === undefined) {
                  setError("Please select an answer.");
                  return;
                }
                setCurrent(current + 1);
              }}
            >
              Next Question
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
