var controller = require('../controllers/pmt-controller');

module.exports = function(app) {
    app.route('/payment').post(controller.payment);
};