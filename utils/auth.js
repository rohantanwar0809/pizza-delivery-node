const { Select } = require("./db").operations
const { decrypt } = require("./hash")
const checkAuth = (req) => {

    if (!req.headers.token) return [false, "Token not present"];

    const hash = Select("token", "content", req.headers.token)
    
    if (!hash) return [false, "Invalid Token"]
    const text = decrypt({
        iv: hash.iv,
        content: hash.content
    })
    
    return [true,text]

}

module.exports = { checkAuth }