
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isRegister && !name)) {
      setError("Please fill in all fields.");
      return;
    }

    if (isRegister && password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? "register" : "login";

      const API_URL = import.meta.env.VITE_API_URL;

const response = await fetch(
  `${API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            isRegister
              ? { name, email, password }
              : { email, password }
          )
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (isRegister) {
        alert("Account created successfully! Please login.");
        setIsRegister(false);
        setName("");
        setPassword("");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/quiz");
      }

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-icon">
          <BookOpen size={34} />
        </div>

        <h1>QuizMaster</h1>

        <p className="subtitle">
          Advanced Web Technology Quiz
        </p>

        <h2>{isRegister ? "Create Account" : "Welcome Back!"}</h2>

        <p className="description">
          {isRegister
            ? "Register to start your learning journey."
            : "Login to continue your quiz."}
        </p>

        <form onSubmit={handleSubmit}>

          {isRegister && (
            <>
              <label>Full Name</label>
              <div className="input-box">
                <User size={19} />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </>
          )}

          <label>Email Address</label>
          <div className="input-box">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label>Password</label>
          <div className="input-box">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </button>

        </form>

        <p className="register-text">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setPassword("");
            }}
          >
            {isRegister ? " Login" : " Sign Up"}
          </span>
        </p>

      </div>
    </div>
  );
}
