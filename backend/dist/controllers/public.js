import prisma from '../lib/prisma.js';
export const getPublicProfile = async (req, res) => {
    try {
        const username = req.params.username;
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
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user.projects);
    }
    catch (error) {
        console.error('Public profile error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
//# sourceMappingURL=public.js.map