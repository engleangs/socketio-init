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

db.customer = ( id, successCallback, errorCallback) => {
  connection.query("SELECT * FROM ecom_customers WHERE id = ?",[ id],(errors, result, fields)=>{
      if( errors) {
          console.log('error call to mysql for this customer : ',id, errors);
          errorCallback( errors);
      }
      else {
         if( result.length > 0) {
             let customer = {
                 id : result[0].id,
                 name : result[0].name,
                 photo : result[0].photo,
                 companyId: result[0].company_id,
             }
             successCallback(customer);
         }
         else {
             successCallback( {});
         }
      }
  });
};
module.exports  = db;