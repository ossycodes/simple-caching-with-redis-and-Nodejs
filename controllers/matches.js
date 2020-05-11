const matchService = require("../services/match.service");

// import DbConfig from "../config/db.config";
const matchingService = new matchService();

exports.getMatchedUsers = async (req, res, next) => {

    const matchedUsers = await matchingService.findMatchedusers(req);
   
    res.send(
        matchedUsers
    );

};

