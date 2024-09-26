import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const serverURL = "http://localhost:3000"; // Update with the actual server URL

// Define types for the survey and response
type Survey = {
  id: number;
  title: string;
  questions: string[];
  responses: string[][];
};

function App() {
  // State for surveys and survey responses
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [surveyResults, setSurveyResults] = useState<string[][] | null>(null); // To store survey responses

  // Fetch the surveys on load
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await axios.get(`${serverURL}/surveys`);
        setSurveys(res.data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, []);

  // Function to handle form submission for survey creation
  const onSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSurvey = { title, questions };
      const res = await axios.post(`${serverURL}/create-survey`, newSurvey);

      // Update the surveys state with the new survey, including the id and responses
      const createdSurvey = res.data as Survey; // Assuming backend returns the full survey with id and responses
      setSurveys((prevSurveys) => [...prevSurveys, createdSurvey]);

      setTitle(""); // Clear the form
      setQuestions([""]); // Reset questions
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  };

  // Function to handle submitting answers to a survey
  const onSurveyAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSurvey) {
      try {
        await axios.post(`${serverURL}/survey/${selectedSurvey.id}/submit`, {
          answers,
        });
        setAnswers([]);
        setSelectedSurvey(null); // Clear selected survey after submission
      } catch (error) {
        console.error("Error submitting survey answers:", error);
      }
    }
  };

  // Add a new question field to the survey creation form
  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  // Handle updating answers for a selected survey
  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handle updating questions when creating a survey
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  // Fetch and display survey results
  const viewSurveyResults = async (surveyId: number) => {
    try {
      const res = await axios.get(`${serverURL}/survey/${surveyId}/results`);
      setSurveyResults(res.data); // Store the survey responses in state
    } catch (error) {
      console.error("Error fetching survey results:", error);
    }
  };

  return (
    <div>
      <h1>Create a New Survey</h1>
      <form onSubmit={onSurveySubmit} style={{ display: "flex", flexDirection: "column" }}>
        <label>
          Survey Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        {questions.map((question, index) => (
          <label key={index}>
            Question {index + 1}:
            <input
              value={questions[index]}
              onChange={(e) => handleQuestionChange(index, e.target.value)} // Use a function to update questions
            />
          </label>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Another Question
        </button>
        <button type="submit">Create Survey</button>
      </form>

      <h2>Take a Survey</h2>
      <div>
        {surveys.length === 0 && <p>No surveys available</p>}
        {surveys.map((survey) => (
          <div key={survey.id}>
            <h3>{survey.title}</h3>
            <button onClick={() => setSelectedSurvey(survey)}>Take Survey</button>
          </div>
        ))}
      </div>

      {selectedSurvey && (
        <div>
          <h2>Answer the Survey: {selectedSurvey.title}</h2>
          <form onSubmit={onSurveyAnswerSubmit}>
            {selectedSurvey.questions.map((question, index) => (
              <label key={index}>
                {question}
                <input
                  type="text"
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </label>
            ))}
            <button type="submit">Submit Answers</button>
          </form>
        </div>
      )}

      <h2>Survey Results</h2>
      <div>
        {surveys.map((survey) => (
          <div key={survey.id}>
            <h3>{survey.title}</h3>
            <button onClick={() => viewSurveyResults(survey.id)}>View Results</button>
          </div>
        ))}
      </div>

      {surveyResults && (
        <div>
          <h2>Survey Responses</h2>
          {surveyResults.length === 0 ? (
            <p>No responses yet</p>
          ) : (
            surveyResults.map((response, index) => (
              <div key={index}>
                <h4>Response {index + 1}</h4>
                {response.map((answer, idx) => (
                  <p key={idx}>
                    Question {idx + 1}: {answer}
                  </p>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
