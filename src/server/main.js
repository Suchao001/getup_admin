import express from 'express';
import ViteExpress from 'vite-express';
import cors from 'cors';
import Admin from './routes/Admin.js';
import User from './routes/User.js';
import Icon from './routes/Icon.js';
import Habit from './routes/Habit.js';


const app = express();
const port = 8000;
const corsOptions = {
  origin: 'http://localhost:8000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  Credential:true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/admin', Admin);
app.use('/api/admin/user', User);
app.use('/api/admin/icon', Icon);
app.use('/api/admin/habit', Habit);

ViteExpress.listen(app, port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
