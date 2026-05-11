import prisma from '../lib/prisma.js';
import redis from '../lib/redis.js';
export const createLink = async (req, res) => {
    try {
        const { label, destination_url, is_private } = req.body;
        const pid = req.params.projectId;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const project = await prisma.project.findUnique({
            where: { id: pid },
            include: { user: true },
        });
        if (!project || project.user_id !== userId) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const link = await prisma.link.create({
            data: {
                label,
                destination_url,
                is_private: is_private || false,
                project_id: pid,
            },
        });
        // Invalidate/Update Redis cache
        const cacheKey = `link:${project.user.username}:${project.slug}:${label}`;
        await redis.set(cacheKey, JSON.stringify({ destination_url, is_private: link.is_private }), 'EX', 86400 // 24 hours
        );
        return res.status(201).json(link);
    }
    catch (error) {
        console.error('Create link error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
export const getLinks = async (req, res) => {
    try {
        const pid = req.params.projectId;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const project = await prisma.project.findUnique({
            where: { id: pid },
        });
        if (!project || project.user_id !== userId) {
            return res.status(404).json({ error: 'Project not found' });
        }
        const links = await prisma.link.findMany({
            where: { project_id: pid },
        });
        return res.json(links);
    }
    catch (error) {
        console.error('Get links error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
//# sourceMappingURL=link.js.map