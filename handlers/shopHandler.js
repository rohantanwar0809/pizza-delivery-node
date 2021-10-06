const { checkAuth } = require("../utils/auth");
const { operations } = require("../utils/db");
const {decrypt} = require('../utils/hash');

const { Select, Insert, Update } = operations;

module.exports = function (req,res) {
    const {method} = req;

    switch (method) {
        case "GET":
            return getItems(req, res)
        case "POST":
            return addItemsToCart(req, res)
        default:
            return res.end('Not found!');
    }
}

const getItems = (req,res) => {

    const {query:{id},isAuthenticated} = req;

    const [authStatus,_] = isAuthenticated;
    if(!authStatus){
        return res.send({
            status:false,
            message:'401 Unauthorized!'
        })
    }
    
    const items = id ? Select("shop","id",id) : Select("shop");
    if(!items){
        return res.send({
            status:false,
            message:'Unable to get items!'
        })
    }
    return res.send({
        status:true,
        data:items
    })
}

const addItemsToCart = (req,res) => {
    const {body:{id},isAuthenticated} = req;

    const [authStatus,userEmail] = isAuthenticated;
    if(!authStatus){
        return res.send({
            status:false,
            message:'401 Unauthorized!'
        })
    }
    const data = {email:userEmail,shopItems:[id]}

    const cartPresent = Select('cart','email',userEmail)
    if(cartPresent){
        if(cartPresent.shopItems.includes(id)){
            return res.send({
                status:false,
                message:'item already present in the cart!'
            })
        }
        cartPresent.shopItems.push(id);
        Update('cart','email',userEmail,cartPresent)
        return res.send({
            status:true,
            message:'cart updated!'
        })
    }

    Insert('cart',data)

    return res.send({
        status:true,
        message:'item added to cart!'
    })
}