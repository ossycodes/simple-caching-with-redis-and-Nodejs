const cacheService = require("./cache.service");

class matchService {
    cacheService;

    constructor() {
        this.cacheService = new cacheService()
    }

    /**
     * @param {*} req
     */
    async findMatchedusers(req) {
    
        // check if contacts for that page are already cached
        const { offset, userId } = req;
        const cachedMatchedUsers = await this.cacheService.getMatchedUsersForPage(
            userId,
            offset
        );

        if (cachedMatchedUsers) {
            console.log("FROM CACHE >>>>>>>>>>>>>>>" + " " + cachedMatchedUsers);
            return cachedMatchedUsers;
        }
        
        /**
         * Purge the cache with the given key
         * Beecause we are giong to cache this 
         * with this key, since it was not prviously cached 
         *  */  
        this.cacheService.purgeCacheNow(userId);

        const fakeMacthedUsersForUserIdFromDB = [{
            "_id": "5ea708a40c244528c0e076c8",
            "isVerifiedUser": false,
            "username": "ossycodes",
            "name": "Emmanuel",
            "gender": "male",
            "verificationCode": "852261",
            "phoneNumber": "+234802344345",
            "location": {
                "coordinates": [
                    -26.0711,
                    -42.8626
                ],
                "_id": "5eb9241ec3e4ac260871eab6",
                "type": "Point"
            },
            "hash": "$2b$10$E0olal5X2.OiOeoVCRZ68OuY7V.xCdlOa.6/vazxUGrsezTHRwGu6",
            "createdAt": "2020-04-27T16:30:28.761Z",
            "updatedAt": "2020-05-11T10:08:30.755Z",
            "__v": 0
        }]

        // cache data for that page
        await this.cacheService.storeMatchedUsersForPage(
            userId,
            fakeMacthedUsersForUserIdFromDB,
            offset
        );

        return fakeMacthedUsersForUserIdFromDB;

    }

}

module.exports = matchService;