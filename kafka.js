const  kafkaNode = require('kafka-node');
const config = require('./config')
const kafka = {
    ready:false,
    onReady:()=>{},
    producer:null,
    consumer:null,
    queue :[],
    onReceiveMessage:(message)=>{},
    replyMessage: (message,callback)=>{
        if( kafka.ready){
            let payload = [
                {topic : config.kafka_topic.fb_message_send_topic, message: message}
            ];
            kafka.producer.send( payload, (err,data)=>{
               if(err){
                   console.log('error send to kafka',err);
                   callback({
                       success:false,
                       error:err
                   });
               }
               else {
                   console.log('success send to kafka', data);
                   callback({
                       success: true,
                       data:data
                   });
               }
            });
        }
        else {
            kafka.queue.push( message);
        }
    }
};
let keyedMessage = kafkaNode.KeyedMessage;
let client = new kafkaNode.KafkaClient(
    config.kafka
);
let producer = new kafkaNode.Producer( client);

producer.on('ready', function () {
    kafka.ready = true;
    console.log("kafka producer ready now can send any message");
    if( kafka.queue.length > 0) {
        kafka.queue.forEach((val,inx)=>{
           kafka.replyMessage( val, (resp)=>{
               console.log("retry send msg " ,resp);
           } );
        });
    }
    if( typeof kafka.onReady =='function') {
        kafka.onReady();
    }

});


kafka.producer = producer;
let consumer = new kafkaNode.Consumer( client, [
        {
            topic: config.kafka_topic.fb_message_receive_topic
        }
    ],
    {
        autoCommit: false,
        encoding: 'utf8',
        keyEncoding: 'utf8'
    });
consumer.on('message',message => {
    console.log('receive message from kafka', message);
     if ( typeof kafka.onReceiveMessage =='function') {
         kafka.onReceiveMessage( message);
     }
});
kafka.client = client;
kafka.consumer = consumer;
producer.on('error', function (err) {});
module.exports = kafka;

