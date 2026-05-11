import { Router } from 'express';
import { register, login } from '../controllers/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
const router = Router();
// Auth Endpoints: 10 requests per minute per IP
const authRateLimit = rateLimiter({ windowMs: 60000, max: 10 });
router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
export default router;
//# sourceMappingURL=auth.js.map