import { Router } from 'express';
import { createProject, getProjects } from '../controllers/project.js';
import { createLink, getLinks, deleteLink } from '../controllers/link.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/projects', getProjects);
router.post('/projects', createProject);

router.get('/projects/:projectId/links', getLinks);
router.post('/projects/:projectId/links', createLink);
router.delete('/links/:linkId', deleteLink);

export default router;
