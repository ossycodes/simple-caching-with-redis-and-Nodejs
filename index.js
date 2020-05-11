const express = require('express');
const macthesController = require("./controllers/matches");

const app = express();
const port = 3000;

app.get("/test", async (req, res, next) => {

    /**
     * This should come from a web client (form) or mobile client, any damn client jare
     */
    req.page = 1;
    req.userId = "5ea708a40c244528c0e076c8";

    const matchedUsers = await macthesController.getMatchedUsers(req, res);
    res.send(matchedUsers);
});

app.listen(port, () => {
    console.log("running");
});