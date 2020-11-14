const crypto = require('crypto');
const redis_client = require('./redis_client');
const config = require('./config');
const auth_util = {};
/**/

auth_util.encrypt = (password, salt) => {
    let iv = crypto
        .createHash("sha256")
        .update(password + ":" + salt, 'utf-8')
        .digest('hex');

    return Buffer.from(iv).toString("base64");
};
auth_util.random_key = (input) => {
    let id = crypto.randomBytes(20).toString('hex');
    let iv = crypto
        .createHash("sha256")
        .update(input + ":" + id, 'utf-8')
        .digest('hex');

    return Buffer.from(iv).toString("base64");
}
auth_util.is_match = (password, salt, encrypted_text) => {
    return auth_util.encrypt(password, salt) === encrypted_text;
};
auth_util.do_auth = (username, input_password, encrypted_password, salt) => {
    if (auth_util.is_match(input_password, salt,  encrypted_password)) {
        let user_input = username + ":" + (new Date().getTime());
        let tokenKey = auth_util.random_key(user_input);
        let key = "token:" + tokenKey;
        redis_client.set(key, username);
        redis_client.expire(key, config.auth.token_ttl);
        return tokenKey;
    }
    return null;


};


auth_util.user = (token_key) => {
    let key = "token:" + token_key;
    let user = redis_client.get(key);
    return user;
};
module.exports = auth_util;