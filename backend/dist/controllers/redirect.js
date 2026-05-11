import prisma from '../lib/prisma.js';
import redis from '../lib/redis.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
export const handleRedirect = async (req, res) => {
    try {
        const username = req.params.username;
        const project_slug = req.params.project_slug;
        const label = req.params.label;
        const cacheKey = `link:${username}:${project_slug}:${label}`;
        // 1. Check Redis
        const cachedData = await redis.get(cacheKey);
        let linkData;
        if (cachedData) {
            linkData = JSON.parse(cachedData);
        }
        else {
            // 2. Cache Miss - Query PostgreSQL
            const link = await prisma.link.findFirst({
                where: {
                    label,
                    project: {
                        slug: project_slug,
                        user: {
                            username,
                        },
                    },
                },
                select: {
                    destination_url: true,
                    is_private: true,
                },
            });
            if (!link) {
                return res.status(404).send('Link not found');
            }
            linkData = link;
            // 3. Populate Redis
            await redis.set(cacheKey, JSON.stringify(linkData), 'EX', 86400);
        }
        // 4. Handle Privacy
        if (linkData.is_private) {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(403).json({ error: 'This is a private link. Authorization required.' });
            }
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded.username !== username) {
                    return res.status(403).json({ error: 'Forbidden: You do not own this project.' });
                }
            }
            catch (error) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }
        }
        // 5. Redirect
        return res.redirect(302, linkData.destination_url);
    }
    catch (error) {
        console.error('Redirect error:', error);
        return res.status(500).send('Internal server error');
    }
};
//# sourceMappingURL=redirect.js.map