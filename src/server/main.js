import express from 'express';
import ViteExpress from 'vite-express';
import cors from 'cors';
import Admin from './routes/Admin.js';
import User from './routes/User.js';


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
ViteExpress.listen(app, port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
