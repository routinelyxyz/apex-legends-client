const routes = require('next-routes');

module.exports = routes()
.add('stats', '/stats/:platform/:name')
.add('items/weapon', '/items/weapon/:slug')
.add('legends/legend', '/legends/:slug')