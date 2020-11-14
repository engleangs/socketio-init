const redis = require('redis')
const  config = require('./config')
const  redis_client = redis.createClient( config.redis);
module.exports = redis_client;
