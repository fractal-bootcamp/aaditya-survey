import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const serverURL = "http://localhost:3000";

function TakeSurveyPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(`${serverURL}/survey/${surveyId}`);
        if (res.data && Array.isArray(res.data.questions)) {
          setSurvey(res.data);
          setAnswers(Array(res.data.questions.length).fill(""));
        } else {
          setError("Survey format is incorrect or questions are missing");
        }
      } catch (err) {
        setError("Failed to fetch survey");
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [surveyId]);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${serverURL}/survey/${surveyId}/submit`, { answers });
      // Redirect to the survey results page after submission
      navigate(`/survey/${surveyId}/results`);
    } catch (err) {
      setError("Failed to submit survey");
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading survey...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  }

  if (!survey) {
    return <p style={{ textAlign: 'center' }}>No survey found.</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Take Survey: {survey.title}</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {survey.questions.map((question, index) => (
          <div key={index}>
            <label style={{ fontWeight: 'bold', marginTop: '10px' }}>{question}</label>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Answer question ${index + 1}`}
              required
              style={{ padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        ))}
        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
          Submit Survey
        </button>
      </form>
    </div>
  );
}

export default TakeSurveyPage;
