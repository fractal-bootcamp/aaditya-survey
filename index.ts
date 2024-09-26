import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

// Use type-only imports for types
import type { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
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

// Helper functions for template handling
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

const processIfStatements = (template: string, variables: Record<string, any>): string => {
  const ifRegex = /{%\s*if\s+([.\w]+)\s*%}([\s\S]*?){%\s*endif\s*%}/g;
  return template.replace(ifRegex, (match, condition, content) => {
    const value = getNestedValue(variables, condition);
    return value ? content : '';
  });
};

const processForLoops = (template: string, variables: Record<string, any>): string => {
  const forRegex = /{%\s*for\s+(\w+)\s+in\s+([.\w]+)\s*%}([\s\S]*?){%\s*endfor\s*%}/g;
  return template.replace(forRegex, (match, item, list, content) => {
    const listValue = getNestedValue(variables, list);
    if (Array.isArray(listValue)) {
      return listValue.map(itemValue => processVariables(content, { [item]: itemValue })).join('');
    }
    return '';
  });
};

const processVariables = (template: string, variables: Record<string, any>): string => {
  const variableRegex = /{{([\s\S]*?)}}/g;
  return template.replace(variableRegex, (match, path) => {
    const trimmedPath = path.trim();
    const value = getNestedValue(variables, trimmedPath);
    return value !== undefined ? String(value) : '';
  });
};

const injectTemplateVariables = (template: string, variables: Record<string, any>): string => {
  let result = template;
  result = processIfStatements(result, variables);
  result = processForLoops(result, variables);
  result = processVariables(result, variables);
  return result;
};

// Routes

// List of surveys
app.get('/', (req: Request, res: Response) => {
  const templatePath = path.join(__dirname, 'templates', 'index.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  const html = injectTemplateVariables(template, {
    title: 'Survey List',
    heading: 'Available Surveys',
    surveys,
  });

  res.send(html);
});

// Survey creation form
app.get('/create-survey', (req: Request, res: Response) => {
  const templatePath = path.join(__dirname, 'templates', 'create-survey.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  const html = injectTemplateVariables(template, {
    title: 'Create Survey',
    heading: 'Create a New Survey',
  });

  res.send(html);
});

// Survey creation POST
app.post('/create-survey', (req: Request, res: Response) => {
  const { title, questions } = req.body;
  const newSurvey: Survey = {
    id: surveyIdCounter++,
    title,
    questions: Array.isArray(questions) ? questions : [questions],
    responses: [],
  };
  surveys.push(newSurvey);
  res.status(201).json(newSurvey);

  res.redirect('/');
});

// Survey submission form
app.get('/survey/:id', (req: Request<{ id: string }>, res: Response) => {
  const surveyId = parseInt(req.params.id, 10);
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return res.status(404).send('Survey not found');
  }

  const templatePath = path.join(__dirname, 'templates', 'take-survey.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  const html = injectTemplateVariables(template, {
    title: `Take Survey: ${survey.title}`,
    survey,
  });

  res.send(html);
});

// Submit survey responses
app.post('/survey/:id/submit', (req: Request<{ id: string }>, res: Response) => {
  const surveyId = parseInt(req.params.id, 10);
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return res.status(404).send('Survey not found');
  }

  const { answers } = req.body;
  survey.responses.push(Array.isArray(answers) ? answers : [answers]);

  res.send("<h1>Thank you for submitting!</h1><a href='/'>Back to Survey List</a>");
});

// View survey results
app.get('/survey/:id/results', (req: Request<{ id: string }>, res: Response) => {
  const surveyId = parseInt(req.params.id, 10);
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return res.status(404).send('Survey not found');
  }

  const templatePath = path.join(__dirname, 'templates', 'results.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  const html = injectTemplateVariables(template, {
    title: `Results for ${survey.title}`,
    survey,
  });

  res.send(html);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
