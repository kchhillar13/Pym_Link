import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare const createProject: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProjects: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
