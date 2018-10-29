const server = require('GraphQLServer');
const config = require('./config').load();

///// inicia servidor
server.start(config);