var express = require("express");

var apiRouter = express.Router();

apiRouter.post("/typeform", (req, res) => {
   console.log(req);
   console.log(JSON.stringify(req.body));
   console.log('-------');
   console.log(res);
   res.status(200).end();
});

module.exports = apiRouter;
