var express = require('express');
var router = express.Router();
const  db = require('../db');
const chat = require('../chat');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  db.fetchUser((result)=>{
      result.forEach(user=>{
            user.last_text = chat.random_last_msg();
      });
    res.json(
        {
          success:true,
          data:result,
          message:'Success'
        });
  },(error)=>{
    res.json({
      success:false,
      message:error.message
    })
  })

});

module.exports = router;
