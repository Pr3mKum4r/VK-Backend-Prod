const db = require("../db");

const saveUserOrder = async(req, res) =>{
    try{
        console.log('Request Body:', req.body);
        const data = {
            orderId: req.body.orderId,
            productIds: req.body.productIds,
            firstName: req.body.userData.firstName,
            lastName: req.body.userData.lastName,
            email: req.body.userData.email,
            phone: req.body.userData.phone,
            address1: req.body.userData.address1,
            address2: req.body.userData.address2,
            city: req.body.userData.city,
            state: req.body.userData.state,
            pin: req.body.userData.pin,
            country: req.body.userData.country,
            amount: req.body.amount
        }

        const userData = await db.userData.create({
            data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            state: data.state,
            pin: data.pin,
            country: data.country
            }
        });
        
        const userOrder = await db.userOrder.create({
            data: {
            orderId: data.orderId,
            userDataId: userData.id,
            products: {
                create: data.productIds.map(productId => ({ productId }))
            },
            isPaid: false,
            price: data.amount
            }
        });
        console.log(userOrder);
        return res.status(200).json({message: "User order saved successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Error in saving user order"}); 
    }
}

module.exports = userController = {
    saveUserOrder
};