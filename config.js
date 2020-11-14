const config = {

};
config.mysql = {

    host :'164.90.223.82',
    user :'dev',
    password:'devCon$iq@@ss2020!!Khmer',
    database:'online_store'
};
config.redis = {
    host:'127.0.0.1',
    auth:''
};
config.auth=  {
    token_ttl: 3600
};
config.kafka = {
    kafkaHost:"164.90.223.82:9092",
}

module.exports  = config
