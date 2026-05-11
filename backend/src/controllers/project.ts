import { Response } from 'express';
import prisma from '../lib/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { slug, title, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!slug || !title) return res.status(400).json({ error: 'Slug and title are required' });

    const existingProject = await prisma.project.findUnique({
      where: {
        user_id_slug: {
          user_id: userId,
          slug,
        },
      },
    });

    if (existingProject) {
      return res.status(400).json({ error: 'Project with this slug already exists for this user' });
    }

    const project = await prisma.project.create({
      data: {
        slug,
        title,
        description,
        user_id: userId,
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const projects = await prisma.project.findMany({
      where: { user_id: userId },
      include: { _count: { select: { links: true } } },
    });

    return res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
