import { CSVRow } from "@shared/schema";

// Sample classification test data
export const testData: CSVRow[] = [
  {
    query: "What is machine learning?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.95
  },
  {
    query: "How does gradient descent work?",
    ground_truth_class: "technique",
    predicted_class: "technique",
    was_correct: true,
    confidence: 0.87
  },
  {
    query: "What is overfitting?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.92
  },
  {
    query: "Can you explain neural networks?",
    ground_truth_class: "explanation",
    predicted_class: "definition",
    was_correct: false,
    confidence: 0.78
  },
  {
    query: "What is cross-validation?",
    ground_truth_class: "technique",
    predicted_class: "technique",
    was_correct: true,
    confidence: 0.82
  },
  {
    query: "How do you calculate precision?",
    ground_truth_class: "calculation",
    predicted_class: "calculation",
    was_correct: true,
    confidence: 0.75
  },
  {
    query: "What are decision trees?",
    ground_truth_class: "definition",
    predicted_class: "explanation",
    was_correct: false,
    confidence: 0.66
  },
  {
    query: "How to implement k-means clustering?",
    ground_truth_class: "technique",
    predicted_class: "technique",
    was_correct: true,
    confidence: 0.91
  },
  {
    query: "What is regularization?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.89
  },
  {
    query: "Calculate the F1 score",
    ground_truth_class: "calculation",
    predicted_class: "technique",
    was_correct: false,
    confidence: 0.58
  },
  {
    query: "Define backpropagation",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.93
  },
  {
    query: "Example of supervised learning?",
    ground_truth_class: "example",
    predicted_class: "definition",
    was_correct: false,
    confidence: 0.63
  },
  {
    query: "How to build a recommendation system?",
    ground_truth_class: "technique",
    predicted_class: "technique",
    was_correct: true,
    confidence: 0.86
  },
  {
    query: "Difference between precision and recall",
    ground_truth_class: "comparison",
    predicted_class: "comparison",
    was_correct: true,
    confidence: 0.79
  },
  {
    query: "What is ensemble learning?",
    ground_truth_class: "definition",
    predicted_class: "technique",
    was_correct: false,
    confidence: 0.71
  },
  {
    query: "What is a confusion matrix?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.84
  },
  {
    query: "How to handle imbalanced data?",
    ground_truth_class: "technique",
    predicted_class: "technique",
    was_correct: true,
    confidence: 0.77
  },
  {
    query: "Explain linear regression",
    ground_truth_class: "explanation",
    predicted_class: "explanation",
    was_correct: true,
    confidence: 0.90
  },
  {
    query: "What is deep learning?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.96
  },
  {
    query: "Compare SVM and logistic regression",
    ground_truth_class: "comparison",
    predicted_class: "explanation",
    was_correct: false,
    confidence: 0.67
  },
  {
    query: "When to use classification vs regression?",
    ground_truth_class: "comparison",
    predicted_class: "comparison",
    was_correct: true,
    confidence: 0.83
  },
  {
    query: "What is transfer learning?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.88
  },
  {
    query: "How to tune hyperparameters?",
    ground_truth_class: "technique",
    predicted_class: "technique",
    was_correct: true,
    confidence: 0.81
  },
  {
    query: "What is feature selection?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.85
  },
  {
    query: "Bias-variance tradeoff explained",
    ground_truth_class: "explanation",
    predicted_class: "comparison",
    was_correct: false,
    confidence: 0.69
  },
  {
    query: "How to evaluate classification models?",
    ground_truth_class: "technique",
    predicted_class: "technique",
    was_correct: true,
    confidence: 0.80
  },
  {
    query: "What is reinforcement learning?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.94
  },
  {
    query: "How to implement PCA?",
    ground_truth_class: "technique",
    predicted_class: "calculation",
    was_correct: false,
    confidence: 0.61
  },
  {
    query: "What is batch normalization?",
    ground_truth_class: "definition",
    predicted_class: "definition",
    was_correct: true,
    confidence: 0.82
  },
  {
    query: "When to use clustering?",
    ground_truth_class: "explanation",
    predicted_class: "technique",
    was_correct: false,
    confidence: 0.65
  }
];