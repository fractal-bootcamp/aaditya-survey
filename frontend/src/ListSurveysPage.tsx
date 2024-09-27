import React, { useEffect, useState } from 'react';
import axios from 'axios';

const serverURL = "http://localhost:3000";

function ListSurveysPage() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    async function fetchSurveys() {
      const response = await axios.get(`${serverURL}/surveys`);
      setSurveys(response.data);
    }

    fetchSurveys();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Available Surveys</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {surveys.map((survey) => (
          <li key={survey.id} style={{ margin: '10px 0', padding: '20px', backgroundColor: '#e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <strong style={{ fontSize: '1.25rem' }}>{survey.title}</strong>
            <div style={{ marginTop: '10px' }}>
              <a href={`/survey/${survey.id}`} style={{ textDecoration: 'none', color: '#3498db', marginRight: '15px', fontWeight: 'bold' }}>Take Survey</a>
              <a href={`/survey/${survey.id}/results`} style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold' }}>View Results</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListSurveysPage;
