var refinancemw = require('../middlewares/refinance-mw');

var controllers = {
    refinance: function(req, res){   
        res.status(200).send('OK');     
        refinancemw.runRefinanceProcess(req.body);
    },
};
module.exports = controllers;