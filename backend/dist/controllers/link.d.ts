import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
export declare const createLink: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getLinks: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
