const express = require("express");

const apiRouter = express.Router();

apiRouter.post("/typeform", (req, res) => {
   // console.log(req);
   console.log('-----');
   console.log(res);
});

module.exports = apiRouter;
