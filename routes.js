const routes = require('next-routes');

module.exports = routes()
.add('stats', '/stats/:platform/:name');