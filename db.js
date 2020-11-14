const  db = {

};
const  mysql      = require('mysql');
const config = require('./config');
const connection = mysql.createConnection( config.mysql);
db.fetchUser = function( successCallback, errorCallBack){
    connection.query("SELECT " +
        "company_id ," +
        "created_at ," +
        "id ," +
        "password, " +
        "phone_number, " +
        "state ," +
        "updated_at ," +
        "username  " +
        " FROM users WHERE state = 1", ( errors,results , fields )=>{
        if( errors){
            console.log("error call to mysql ",errors);
            errorCallBack(errors);
            return;
        }
        successCallback(results);

    });
};

/**
* @return json  object with property
 *
*
* */

db.user = ( username, successCallBack , errorCallBack)=>{
    connection.query( {
        sql: " SELECT * FROM users WHERE username= ? ",
        values: [username]
    }, ( errors, result, fields)=>{
       if( errors) {
           console.log("Error call to mysql for users ", errors);
           errorCallBack( errors);
           return;
       }
       const  authResult = {
           success: true,
           message : "Success",
           data : null
       };

       if( result.length > 0) {
           const user = result[0];
           authResult.data = user;
       }
       else {
           authResult.success = false;
           authResult.message = "Not found";
       }
       successCallBack( authResult );

    });

};
module.exports  = db;