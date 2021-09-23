import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@udemy-ts-tickets/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { updateTicketRouter } from './routes/update';

const app = express();

app.set('trust proxy', true); // we're telling express that it can trust the ingress service proxy

app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV != 'test' }));
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
