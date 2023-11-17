var controller = require('../controllers/refinance-controller');

module.exports = function(app) {
    app.route('/refinance').post(controller.refinance);
};