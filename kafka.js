const  kafkaNode = require('kafka-node');
const config = require('./config')
const kafka = {};
let keyedMessage = kafkaNode.KeyedMessage;
let client = new kafkaNode.KafkaClient(
    config.kafka
);
let producer = new kafkaNode.Producer( client);
let  payloads = [
    { topic: 'topic1', messages: 'hi', partition: 0 },
    { topic: 'topic2', messages: ['hello', 'world'] }
];

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
});
kafka.producer = producer;
kafka.client = client;
producer.on('error', function (err) {});
module.exports = kafka;
