var express = require("express");

var apiRouter = express.Router();

apiRouter.post("/typeform", (req, res) => {
   console.log(JSON.stringify(req));
   // console.log(JSON.stringify(req.body));
   console.log('-------');
   console.log(JSON.stringify(res));
   res.status(200).end();
});

module.exports = apiRouter;
