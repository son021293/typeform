var express = require("express");

var apiRouter = express.Router();

apiRouter.post("/typeform", (req, res) => {
   console.log('11111111');
   console.log(req);
   console.log('-----');
   console.log(res);
});

module.exports = apiRouter;
