import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const username = req.params.username as string;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        projects: {
          include: {
            links: {
              where: {
                is_private: false,
              },
            },
          },
        },
      },
    }) as any;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user.projects);
  } catch (error) {
    console.error('Public profile error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
