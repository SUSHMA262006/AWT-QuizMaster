
const express = require("express");
const jwt = require("jsonwebtoken");
const Result = require("../models/Result");

const router = express.Router();

// Authentication middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

// AWT quiz answer key (must match Quiz.tsx)
const correctAnswers = [0, 2, 1, 0, 2];

// SAVE QUIZ RESULT
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { answers } = req.body;

    if (
      !Array.isArray(answers) ||
      answers.length !== correctAnswers.length ||
      answers.some(
        answer =>
          !Number.isInteger(answer) ||
          answer < 0 ||
          answer > 3
      )
    ) {
      return res.status(400).json({
        message: "Please submit all five valid answers"
      });
    }

    const score = answers.reduce(
      (total, answer, index) =>
        total + (answer === correctAnswers[index] ? 1 : 0),
      0
    );

    const result = await Result.create({
      userId: req.userId,
      score,
      totalQuestions: 5,
      correctAnswers: score,
      wrongAnswers: 5 - score,
      percentage: (score / 5) * 100,
      answers
    });

    res.status(201).json({
      message: "Quiz result saved successfully",
      result
    });

  } catch (error) {
    console.error("Result saving error:", error.message);

    res.status(500).json({
      message: "Unable to save quiz result"
    });
  }
});

// GET LOGGED-IN STUDENT'S RESULTS
router.get("/my-results", verifyToken, async (req, res) => {
  try {
    const results = await Result.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(results);

  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch results"
    });
  }
});

module.exports = router;
