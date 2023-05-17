import express from 'express';
import buildRouter from './routes';
import cors from 'cors';
import corsOpts from './config/cors-config';
import Variables from './config/variables';

const app = express();
const port = Variables.port;

// CORS middleware
app.use(cors(corsOpts));

/**
 * Parses incoming JSON requests and
 * puts the parsed data in req.body
 */
app.use(express.json());

/**
 * Builds a root router
 * appends specific routers to it
 * and then appends the root router to the app
 */
buildRouter(app);

// Start listening for requests
app.listen(port);
