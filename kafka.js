const  kafkaNode = require('kafka-node');
const config = require('./config')
const  uuid = require('uuid')
const kafka = {
    ready:false,
    onReady:()=>{},
    producer:null,
    consumer:null,
    queue :[],
    onReceiveMessage:(message)=>{},
    replyMessage: (message,callback)=>{
        if( kafka.ready){
            let id = uuid.v4();
            let payload = [
                {topic : config.kafka_topic.fb_message_send_topic, messages: [message]  , key: id}
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
               console.log("msg to send : ",val)
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
var data = {
    'page_id':'678898225861636',
    'receipt_id':'678898225861636',
    'message':'hello'
};
const str = JSON.stringify( data );
kafka.replyMessage( str , function ( data) {
   console.log( 'resp from kafka', data);
});
module.exports = kafka;

