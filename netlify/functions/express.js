import serverless from 'serverless-http';
import app from '../../app.js';

const expressApp = app && app.default ? app.default : app;

export const handler = serverless(expressApp);
