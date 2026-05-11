import { Router } from 'express';
import { handleRedirect } from '../controllers/redirect.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
const router = Router();
// Public Endpoints: 100 requests per minute per IP
const publicRateLimit = rateLimiter({ windowMs: 60000, max: 100 });
router.get('/:username/:project_slug/:label', publicRateLimit, handleRedirect);
export default router;
//# sourceMappingURL=redirect.js.map