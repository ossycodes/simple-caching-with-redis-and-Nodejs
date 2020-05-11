const redis = require("redis");
const { promisify } = require("util");

module.exports = class CacheService {

    getMatchedUsersForPageField = page => `matchedpage${page}`;
    getContactField = contactId => `matchedusers${contactId}`;
    getUserKey = userId => `user${userId}`;
    client;
    asyncHget;
    asyncHset;
    asyncExpire;
    asyncTTL;

    constructor() {
        this.client = redis.createClient(6379);

        this.client.on("connect", () => {
            console.log("Connected to Redis caching server");
        });

        this.client.on("error", console.error);

        // promisify Redis Node client API
        this.asyncHget = promisify(this.client.hget).bind(this.client);
        this.asyncHset = promisify(this.client.hset).bind(this.client);
        this.asyncExpire = promisify(this.client.expire).bind(this.client);
    }

    /**
     *
     * @param {import("mongoose").Schema.Types.ObjectId} userId
     * @param {number} page
     */
    async getMatchedUsersForPage(userId, page = 1) {
        const usId = this.getUserKey(userId);
        const ctp = this.getMatchedUsersForPageField(page);
        const matchedUsers = await this.asyncHget(usId, ctp);

        return matchedUsers ? JSON.parse(matchedUsers) : null;
    }

    /**
     *
     * @param {import("mongoose").Schema.Types.ObjectId} userId
     * @param {Array} contacts
     * @param {number} page
     */
    async storeMatchedUsersForPage(userId, matchedUsers, page = 1) {
        console.log("Storing data in cache >>>>>>>>>>>>>>>>>>>>>>>>>");
        const usId = this.getUserKey(userId);
        const stored = await this.asyncHset(
            usId,
            this.getMatchedUsersForPageField(page),
            JSON.stringify(matchedUsers)
        );
        // set auto expire after 1 day
        await this.asyncExpire(usId, 60 * 60 * 24);

        return stored;
    }

    /**
     *
     * @param {import("mongoose").Schema.Types.ObjectId} userId
     */
    async purgeCacheNow(userId) {
        const usId = this.getUserKey(userId);
        return await this.asyncExpire(usId, 0);
    }

    /**
     *
     * @param {import("mongoose").Schema.Types.ObjectId} userId
     * @param {number} seconds
     */
    async purgeCache(userId, seconds) {
        const usId = this.getUserKey(userId);
        return await this.asyncExpire(usId, seconds);
    }

}
