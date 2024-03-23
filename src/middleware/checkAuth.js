const { verifyToken } = require('../utils/jwt');
const db = require('../models');
const redisClient = require('../utils/redis');

exports.verifyToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        
        if (!authorizationHeader) {
            return res.status(401).json({ success: false, message: 'Token Validation Failed: Authorization header missing' });
        }

        const token = authorizationHeader.split(' ')[1];
        const tokenInRedis = await redisClient.get(token);

        if (tokenInRedis) {
            const userDetails = await verifyToken(tokenInRedis);
            req.userDetails = userDetails;
            next();
        } else {
            const tokenData = await db.token.findOne({ where: { token } });
            if (!tokenData) {
                return res.status(401).json({ success: false, message: 'Token Validation Failed: Invalid token' });
            }

            const empDetails = await verifyToken(token);
        
            if (!empDetails) {
                return res.status(401).json({ success: false, message: 'Token Validation Failed: Invalid user details' });
            }
            const activeUser = await db.employee.findOne({ where: { email: empDetails.email, isActive: true } });

            if (!activeUser) {
                return res.status(401).json({ success: false, message: 'Token Validation Failed: User not active or unauthorized' });
            }

            await redisClient.setEx(token, 1800, token);
            req.userDetails = empDetails;

            next();
        }
    } catch (error) {
        next(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
