import redis from '../lib/redis.js';
export const rateLimiter = (config) => {
    return async (req, res, next) => {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = req.ip || (Array.isArray(forwarded) ? forwarded[0] : forwarded) || 'unknown';
        const key = `ratelimit:${req.path}:${ip}`;
        try {
            const current = await redis.get(key);
            const count = current ? parseInt(current) : 0;
            if (count >= config.max) {
                return res.status(429).json({ error: 'Too many requests, please try again later.' });
            }
            const multi = redis.multi();
            multi.incr(key);
            if (count === 0) {
                multi.pexpire(key, config.windowMs);
            }
            await multi.exec();
            next();
        }
        catch (error) {
            console.error('Rate limiter error:', error);
            next(); // Fail open if Redis is down
        }
    };
};
//# sourceMappingURL=rateLimiter.js.map