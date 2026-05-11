import { Request, Response } from 'express';
export declare const handleRedirect: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
