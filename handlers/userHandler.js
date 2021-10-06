const { operations } = require("../utils/db")

const { Select, Insert, Delete, Update } = operations

module.exports = function (req, res) {

    const { method} = req

    switch (method) {
        case "GET":
            return getUser(req, res)
        case "POST":
            return createUser(req, res)
        case "DELETE":
            return deleteUser(req, res)
        case "PUT":
            return updateUser(req, res)
        default:
            return res.end('Not found!');
    }


}


const getUser = (req, res) => {
    const { query } = req
    const user = Select("users", "id", query.id)
    if (!user) {
        return res.send({
            status: false,
            message: "No user found by this id  : " + query.id
        })
    }
    return res.send(user)
}

const createUser = (req, res) => {
    try {
        const { body } = req
        const storeData = Insert('users', body)
        return res.send({
            status: true,
            message: "New user created!"
        })
    } catch (error) {
        return res.send({
            status: false,
            message: "Unable to save user!"
        })
    }

}

const deleteUser = (req, res) => {
    const { query } = req
    const message = Delete("users", "id", query.id)
    return res.send({ status: true, message })
}

const updateUser = (req, res) => {
    try {
        const { body, query} = req
        Update('users', "id", query.id, { id: query.id, ...body })
        return res.send({
            status: true,
            message: "User data updated!"
        })
    } catch (error) {
        return res.send({
            status: false,
            message: "Unable to update user data!"
        })
    }
}