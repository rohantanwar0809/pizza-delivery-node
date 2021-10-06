const { operations } = require("../utils/db")
const { encrypt } = require("../utils/hash")


const { Select, Insert,Delete } = operations


module.exports = function (req,res) {
    const {method} = req;
    switch(method){
        case 'POST':
            return login(req,res);
        case 'DELETE':
            return logout(req,res);
    }
}

const login = function (req, res) {

    const { method, body } = req

    if (method !== "POST") {
       return res.send(req.url + " Not found")
    }

    const user = Select("users", "email", body.email)

    if (user) {
        const hash = encrypt(user.email)
        const d = new Date()
        Insert("token", {
            ...hash,
            timeStamp: d.toUTCString()
        })
        return res.send({
            status: true,
            token: hash.content
        })
    } else {
        return res.send({
            status: false,
            messgae: "User not found"
        })
    }
}

const logout = function (req, res) {

    const msg = Delete("token", "id",req.headers.token)

    if (msg) {
        return res.send({
            status: true,
            message: msg
        })
    } else {
        return res.send({
            status: false,
            messgae: "Unable to logout"
        })
    }
}
