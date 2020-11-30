const express = require('express');
const ExpressError = require('./expressError');
const routes = require("./routes/routes");

const app = express();

app.use(express.json());
app.use("/items", routes);


// 404 handler
app.use(function(req, res, next){
  return new ExpressError("Page Not Found", 404);
});

// general error handler
app.use(function(err, req, res, next) {
  // the default status is 500 Internal Server Error
  res.status(err.status || 500);

  return res.json({
    error: err.message
  });
});

module.exports = app;