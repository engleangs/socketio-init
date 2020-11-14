const redis_client = require('./redis_client');
const  chat = require('./chat');
const  kafka = require('./kafka');
const  socket  = {
    io:null
};
socket.init = (io)=>{
    socket.io = io;
    io.on('connect', socket.connect);
    io.use( socket.middleware);
};


socket.connect = ( my_socket )=>{

    kafka.producer.send([{
        topic:'message',
        message :JSON.stringify({
            'demo':"this is the demo",
            "yes":"this is the test"
        })
    }], (error, data)=>{
         console.log('error', error);
         console.log( 'data', data);
    });
    console.log('connect', my_socket);
    redis_client.sadd('socket_id',my_socket.id);//add socket id to the redis
    //console.log("on connect ", my_socket);
    console.log('my id', my_socket.id);
    my_socket.emit('message', socket.text_msg('Welcome to my system '));
    // handle the event sent with socket.send()
    my_socket.on('message', (data) => {
        console.log( 'receiving message ',data);
        var rnd = chat.random_integer(2)+1;
        if( rnd %2 ==1){
            //my_socket.emit('message', socket.text_msg(  chat.random_reply()) );//auto reply
        }

        if( rnd%2 ==0) {
            for(var i =0;i<rnd;i++){
                let msg = socket.text_msg( chat.random_reply());
                console.log(' send auto reply to user ', msg);
                my_socket.emit('message',  msg);
            }
        }
        else {
            console.log(" no send ");
        }



    });
    my_socket.emit('demo', {
        hello:'data'
    });


    // handle the event sent with socket.emit()
    my_socket.on('salutations', (elem1, elem2, elem3) => {
        console.log(elem1, elem2, elem3);
    });
    my_socket.on('disconnecting',()=>{
        //console.log('disconnecting', my_socket);
        redis_client.srem('socket_id',my_socket.id);
    });
    my_socket.on('disconnect', ()=>{
            console.log( 'disconnect');
    });
};

socket.disconnecting = ( my_socket) =>{

    //const rooms = Object.keys(my_socket.rooms);
    console.log( 'disconnecting ...', my_socket);

    // socket.on('disconnect', () => {
    //     // socket.rooms === {}
    // });
};

socket.middleware = ( my_scoket, next)=> {
    let token = my_scoket.handshake.query.token;
    console.log( 'token', token);
    if (isValid(token)) {
        return next();
    }
    return next(new Error('authentication error'));
};

socket.disconnect = ( my_socket)=>{
        console.log( 'disconnect', my_socket);
};

socket.send_to = (id, my_socket) => {

};

socket.text_msg = ( text)=>{
  return {
      content : text,
      type : 'text'
  }  ;
};

function isValid() {
    return true;//todo
}
module.exports = socket;