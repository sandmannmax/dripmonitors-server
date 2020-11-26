import { Application, json, Request, NextFunction, Response } from 'express';
import cors from 'cors';
import { IError } from '../types/IError';
import api from '../api';

export default async (app: Application) => {

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });

  app.use(json());
  app.use(cors());
  app.use('/', api());

  app.use((req: Request, res: Response, next: NextFunction) => {
    let err: IError = {message: 'Not Found', status: 404};
    next(err);
  });
  app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({error: {
      message: err.message
    }});
  });
  
  return app;
}