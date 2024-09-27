import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const serverURL = "http://localhost:3000";

interface SurveyResults {
  title: string;
  responses: string[][];
}

function SurveyResultsPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${serverURL}/survey/${surveyId}/results`);
        setResults(res.data);
      } catch (err) {
        setError("Failed to fetch survey results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [surveyId]);

  const handleBackToHome = () => {
    navigate("/create-survey");
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading results...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Survey Results for {results?.title}</h1>
      {results?.responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <ul>
          {results?.responses.map((response, index) => (
            <li key={index} style={{ margin: '10px 0', padding: '20px', backgroundColor: '#e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <strong>Response {index + 1}</strong>
              {response.map((answer, idx) => (
                <p key={idx} style={{ margin: '5px 0' }}>Question {idx + 1}: {answer}</p>
              ))}
            </li>
          ))}
        </ul>
      )}

      {/* Back to Home Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={handleBackToHome} 
          style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
        >
          Back to Create Survey
        </button>
      </div>
    </div>
  );
}

export default SurveyResultsPage;
