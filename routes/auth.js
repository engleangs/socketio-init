var express = require('express');
var router = express.Router();
const db = require('../db');
const auth_util = require('../auth_util');
router.post('/', (req, res, next) => {
    const json = req.body
    let username = json["username"];
    let password = json["password"];
    const  errorData = {
        success: false,
        message: "Unauthorized"
    };
    db.user(username, ( result) => {
        if( result.success) {
            let user = result.data;
            let token = auth_util.do_auth(username, password, user.password, user.password_salt);
            if (token === null) {
                res.json( errorData );
            } else {
                res.json({
                    success: true,
                    message: "Success",
                    data: token
                });
            }
        }
        else {
            res.json( errorData );
        }

    }, (error) => {
        res.json({
            success: false,
            message: error.message
        });
    });


});

module.exports = router;
