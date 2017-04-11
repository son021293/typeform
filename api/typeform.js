var express = require("express");
var formidable = require('formidable'),
    util = require('util');

var apiRouter = express.Router();

apiRouter.post("/typeform", (req, res) => {
   var form = new formidable.IncomingForm();

   form.parse(req, (err, fields, files) => {
       res.json({fields: fields});
       res.status(200).end();
   });

});

module.exports = apiRouter;
