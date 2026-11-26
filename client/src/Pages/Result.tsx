
import { useNavigate } from "react-router-dom";
import { Trophy, CheckCircle, XCircle, RotateCcw, LogOut } from "lucide-react";

export default function Result() {
  const navigate = useNavigate();

  const result = JSON.parse(
    localStorage.getItem("quizResult") || "null"
  );

  if (!result) {
    return (
      <div className="result-page">
        <div className="result-card">
          <h2>No quiz result found!</h2>
          <button className="result-button" onClick={() => navigate("/quiz")}>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const { score, total, answers, questions } = result;
  const wrong = total - score;
  const percentage = Math.round((score / total) * 100);

  const retakeQuiz = () => {
    localStorage.removeItem("quizResult");
    navigate("/quiz");
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("quizResult");
    navigate("/");
  };

  return (
    <div className="result-page">
      <div className="result-card">

        <div className="trophy-icon">
          <Trophy size={42} />
        </div>

        <h1>Quiz Completed!</h1>
        <p className="result-subtitle">
          Advanced Web Technology Assessment
        </p>

        <div className="score-circle">
          <h2>{percentage}%</h2>
          <p>Your Score</p>
        </div>

        <h2 className="performance">
          {percentage >= 80
            ? "Excellent Performance!"
            : percentage >= 60
            ? "Good Job!"
            : percentage >= 40
            ? "Keep Practicing!"
            : "Don't Give Up!"}
        </h2>

        <div className="result-stats">
          <div className="stat-box">
            <h2>{total}</h2>
            <p>Total Questions</p>
          </div>

          <div className="stat-box correct">
            <CheckCircle size={23} />
            <h2>{score}</h2>
            <p>Correct Answers</p>
          </div>

          <div className="stat-box wrong">
            <XCircle size={23} />
            <h2>{wrong}</h2>
            <p>Wrong Answers</p>
          </div>
        </div>

        <h3 className="review-title">Answer Review</h3>

        <div className="answer-review">
          {questions.map((q: any, index: number) => (
            <div className="review-item" key={index}>
              <p className="review-question">
                {index + 1}. {q.question}
              </p>

              <p>
                Your answer: {q.options[answers[index]]}
              </p>

              <p className="correct-answer">
                Correct answer: {q.options[q.answer]}
              </p>

              <span className={
                answers[index] === q.answer
                  ? "status-correct"
                  : "status-wrong"
              }>
                {answers[index] === q.answer ? "Correct" : "Incorrect"}
              </span>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button className="result-button" onClick={retakeQuiz}>
            <RotateCcw size={18} /> Retake Quiz
          </button>

          <button className="logout-button" onClick={logout}>
            <LogOut size={18} /> Logout
          </button>
        </div>

      </div>
    </div>
  );
}
