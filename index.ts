import express from 'express';
import buildRouter from './routes';

const app: express.Express = express();
const port = 3000;

// Parses incoming JSON requests and
// puts the parsed data in req.body
app.use(express.json());

// Create routes
buildRouter(app);

// Start listening for requests
app.listen(port);
