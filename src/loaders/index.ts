import { Application } from 'express';
import expressLoader from './express';

export default async (expressApp: Application) => {
  await expressLoader(expressApp);
  console.log('Express Initialized');  
}