const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const port =process.env.PORT || 3000;

var refinanceRoutes = require('./routes/refinance-routes'); refinanceRoutes(app);
var pmtRoutes = require('./routes/pmt-routes'); pmtRoutes(app);

app.listen(port,function(){ console.log('Server started on port: ' + port); });