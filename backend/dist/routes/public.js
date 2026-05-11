import { Router } from 'express';
import { getPublicProfile } from '../controllers/public.js';
const router = Router();
router.get('/:username', getPublicProfile);
export default router;
//# sourceMappingURL=public.js.map