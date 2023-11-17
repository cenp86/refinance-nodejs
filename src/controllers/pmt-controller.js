var pmtmw = require('../middlewares/pmt-mw');

var controllers = {
    payment: function(req, res){   
        res.status(200).send('OK');    
        pmtmw.runPaymentProcess(req.body);
    },
};
module.exports = controllers;