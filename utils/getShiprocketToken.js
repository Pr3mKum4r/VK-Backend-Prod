const db = require('../db');

const getLatestToken = async () => {
    try {
        const latestTokenEntry = await db.shiprocketToken.findFirst({
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (latestTokenEntry) {
            return latestTokenEntry.token;
        }
        throw new Error('No token found in the database');
    } catch (error) {
        console.error('Failed to fetch the latest token:', error);
        throw error;
    }
};

module.exports = { getLatestToken };