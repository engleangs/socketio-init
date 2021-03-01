const redis_client = require('./redis_client');
const chat = require('./chat');
const kafka = require('./kafka');
const db = require('./db');
const socket = {
    io: null
};
socket.init = (io) => {
    socket.io = io;
    io.on('connect', socket.connect);
    io.use(socket.middleware);
};


socket.connect = (my_socket) => {

    // kafka.producer.send([{
    //     topic:'message',
    //     message :JSON.stringify({
    //         'demo':"this is the demo",
    //         "yes":"this is the test"
    //     })
    // }], (error, data)=>{
    //      console.log('error', error);
    //      console.log( 'data', data);
    // });
    console.log('connect', my_socket);
    redis_client.sadd('socket_id', my_socket.id);//add socket id to the redis
    //console.log("on connect ", my_socket);
    console.log('my id', my_socket.id);
    //my_socket.emit('message', socket.text_msg('Welcome to my system '));
    // handle the event sent with socket.send()
    my_socket.on('message', (data) => {
        //expected data
        // var chatMessage = {
        //     content:message,
        //     senderId: this.myData.id,
        //     pageId :this.myData.page_id,
        //     receiverId : this.person.id,
        // }
        console.log('receiving message ', data);
        kafka.replyMessage(JSON.stringify(data), (result) => {
            console.log('forward to kafka result ', result);
        });


    });
    my_socket.emit('demo', {
        hello: 'data'
    });


    // handle the event sent with socket.emit()
    my_socket.on('salutations', (elem1, elem2, elem3) => {
        console.log(elem1, elem2, elem3);
    });
    my_socket.on('disconnecting', () => {
        //console.log('disconnecting', my_socket);
        redis_client.srem('socket_id', my_socket.id);
    });
    my_socket.on('disconnect', () => {
        console.log('disconnect');
    });
};

socket.disconnecting = (my_socket) => {

    //const rooms = Object.keys(my_socket.rooms);
    console.log('disconnecting ...', my_socket);

    // socket.on('disconnect', () => {
    //     // socket.rooms === {}
    // });
};

socket.middleware = (my_scoket, next) => {
    let token = my_scoket.handshake.query.token;
    console.log('token', token);
    if (isValid(token)) {
        return next();
    }
    return next(new Error('authentication error'));
};

socket.disconnect = (my_socket) => {
    console.log('disconnect', my_socket);
};

socket.send_to = (id, my_socket) => {

};

socket.text_msg = (text) => {
    return {
        content: text,
        type: 'text'
    };
};

function isValid() {
    return true;//todo
}

module.exports = socket;
kafka.onReceiveMessage = (kafaMessage) => {
    const value = kafaMessage.value;
    const data = JSON.parse(value);
    if (data["entry"]) {
        let entry = data["entry"][0];
        if (entry["messaging"]) {
            let message = entry["messaging"][0];
            let sender = message["sender"];
            let receiver = message["recipient"];
            let msg = message["message"];
            if(!msg){
                console.log('finish the data');
                return;
            }
            let msgId = msg["mid"];
            let content = msg["text"];
            let type = "text"; //todo
            let customerId = sender.id;
            let pageId = receiver.id;
            db.customer(customerId, (customer) => {
                let chat = {
                    photo: customer.photo,
                    name: customer.name,
                    senderId: customerId,
                    receiverId: receiver.id,
                    companyId: customer.companyId,
                    writerName: customer.name,
                    content: content,
                    type: type,
                    pageId: pageId,
                    cratedAt: message['timestamp'],
                    replied: false,

                };
                console.log('chat msg', chat);
                try {
                    socket.io.emit('message', chat);//todo send to specific user
                } catch (e) {
                    console.log('error broadcast  to client ', e);
                }
            }, (error) => {
                console.log('query error so done...', error);
            })

        }
    }
};
//todo: when receiving mesage from chat java script forward it to kafka immediately
//todo : when receiging message from chat from kafka foward it to socket immediately but need to do routing ( come from which page and which current user is online now )