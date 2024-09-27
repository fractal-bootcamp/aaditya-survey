import { useEffect, useState } from "react";
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

  // Function to delete a question by index
  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '20px' }}>
      <div style={{ maxWidth: '900px', width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Create a New Survey</h1>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={onSurveySubmit}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Survey Title:</label>
            <input
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter survey title"
            />
          </div>

          {questions.map((question, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flexGrow: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Question {index + 1}:</label>
                <input
                  style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  value={questions[index]}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder={`Enter question ${index + 1}`}
                />
              </div>
              <button
                type="button"
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  height: 'fit-content',
                  alignSelf: 'center',
                }}
                onClick={() => deleteQuestion(index)}
              >
                Delete
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
              onClick={addQuestion}
            >
              Add Another Question
            </button>
            <button
              type="submit"
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
            >
              Create Survey
            </button>
          </div>
        </form>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>Take a Survey</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {surveys.length === 0 && <p style={{ textAlign: 'center' }}>No surveys available</p>}
          {surveys.map((survey) => (
            <div key={survey.id} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>{survey.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#6f42c1', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                  onClick={() => setSelectedSurvey(survey)}
                >
                  Take Survey
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedSurvey && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Answer the Survey: {selectedSurvey.title}</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={onSurveyAnswerSubmit}>
              {selectedSurvey.questions.map((question, index) => (
                <div key={index}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>{question}</label>
                  <input
                    type="text"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={`Answer question ${index + 1}`}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                >
                  Submit Answers
                </button>
              </div>
            </form>
          </div>
        )}

        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>Survey Results</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {surveys.map((survey) => (
            <div key={survey.id} style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>{survey.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#6f42c1', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                  onClick={() => viewSurveyResults(survey.id)}
                >
                  View Results
                </button>
              </div>
            </div>
          ))}
        </div>

        {surveyResults && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>Survey Responses</h2>
            {surveyResults.length === 0 ? (
              <p style={{ textAlign: 'center' }}>No responses yet</p>
            ) : (
              surveyResults.map((response, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: 'bold', textAlign: 'center' }}>Response {index + 1}</h4>
                  {response.map((answer, idx) => (
                    <p key={idx} style={{ textAlign: 'center' }}>
                      Question {idx + 1}: {answer}
                    </p>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
