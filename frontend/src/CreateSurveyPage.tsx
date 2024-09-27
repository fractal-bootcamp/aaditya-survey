import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const serverURL = "http://localhost:3000";

function CreateSurveyPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  const onSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSurvey = { title, questions };
      await axios.post(`${serverURL}/create-survey`, newSurvey);
      navigate("/");  // Redirect to home page after creation
    } catch (error) {
      console.error("Error creating survey:", error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Create a New Survey</h1>
      <form onSubmit={onSurveySubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontWeight: 'bold', marginTop: '10px' }}>Survey Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        {questions.map((question, index) => (
          <div key={index}>
            <label style={{ fontWeight: 'bold', marginTop: '10px' }}>Question {index + 1}:</label>
            <input
              type="text"
              value={questions[index]}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              required
              style={{ padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>
        ))}

        <button type="button" onClick={addQuestion} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
          Add Another Question
        </button>
        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
          Create Survey
        </button>
      </form>
    </div>
  );
}

export default CreateSurveyPage;
