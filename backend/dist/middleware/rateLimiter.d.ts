import { Request, Response, NextFunction } from 'express';
interface RateLimitConfig {
    windowMs: number;
    max: number;
}
export declare const rateLimiter: (config: RateLimitConfig) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
