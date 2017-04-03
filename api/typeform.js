var express = require("express");

var apiRouter = express.Router();

apiRouter.post("/typeform", (req, res) => {
   console.log(JSON.stringify(req.body));
   res.status(200).end();
});

module.exports = apiRouter;
