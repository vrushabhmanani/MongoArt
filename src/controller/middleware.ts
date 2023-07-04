import jwt from 'jsonwebtoken';

const authenticate = (req: any, res: any, next: any) => {
    var token = req.headers.authorization ? req.headers.authorization.split(" ") : [];
    if (token.length == 0 || token[0] != "Bearer" || token[1] == "") {
        return res.json({ 'res': '1', 'msg': "Token  is required." });
    } else {
        jwt.verify(token[1], "jwt_secret", (err: any, data: any) => {
            if (err) {
                return res.json({ 'res': '1', 'msg': err });
            } else {
                req.body.login_user_id = data._id;
                req.body.login_user_role = data.role;
                return next();
            }
        });
    }
}

module.exports = { authenticate }