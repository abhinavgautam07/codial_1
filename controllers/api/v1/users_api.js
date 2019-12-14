const User = require('../../../models/users_schema');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');
module.exports.createSession = async function(req, res) {
    try {

        let user = await User.findOne({ email: req.body.email });
        if (!user || user.password != req.body.password) {
            return res.json(422, {
                message: "invalid username or password"
            });
        } else {
            console.log("converting user to json", user.toJSON());
            return res.json(200, {
                message: "sign in Succesful",
                data: {
                    token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: 100000 })
                        //user.toJSON is the part that get encrypted and there is header and signature
                }
            });
        }

    } catch (err) {
        console.log(err);
        return;
    }


}