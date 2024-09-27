import express from 'express';
import cors from 'cors';

// Use type-only imports for types
import type { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory storage for surveys and questions
interface Survey {
  id: number;
  title: string;
  questions: string[];
  responses: string[][];
}

let surveys: Survey[] = [];
let surveyIdCounter = 1;

// Routes

// API endpoint to get the list of surveys in JSON format
app.get('/surveys', (req: Request, res: Response) => {
  res.json(surveys);
});

// Survey creation POST
app.post('/create-survey', (req: Request, res: Response) => {
  const { title, questions } = req.body;
  
  if (!title || !questions) {
    return res.status(400).json({ error: 'Title and questions are required' });
  }

  const newSurvey: Survey = {
    id: surveyIdCounter++,
    title,
    questions: Array.isArray(questions) ? questions : [questions],  // Ensure questions is an array
    responses: [],
  };
  
  surveys.push(newSurvey);
  res.status(201).json(newSurvey);  // Send JSON response
});

// API endpoint to get a single survey by ID
app.get('/survey/:id', (req: Request<{ id: string }>, res: Response) => {
  const surveyId = parseInt(req.params.id, 10);
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  res.json(survey);
});

// API endpoint to submit survey responses
app.post('/survey/:id/submit', (req: Request<{ id: string }>, res: Response) => {
  const surveyId = parseInt(req.params.id, 10);
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  const { answers } = req.body;

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers should be an array' });
  }

  survey.responses.push(answers);
  res.json({ message: 'Survey submitted successfully' });
});

// API endpoint to get survey results
app.get('/survey/:id/results', (req: Request<{ id: string }>, res: Response) => {
  const surveyId = parseInt(req.params.id, 10);
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  res.json({ title: survey.title, responses: survey.responses });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
