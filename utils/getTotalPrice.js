const db = require("../db");

//Total price calculator function with productIds as an input array.
async function calculateTotalPrice(productIds){
    try 
    {
        let totalPrice = 0;
        //get every product through a for loop and add its price to an aggregate
        for (const productId of productIds) {
            const product = await db.product.findUnique({
                where: {
                id: productId,
                },
                select: {
                price: true,
                },
            });
            if (product) {
                totalPrice += parseInt(product.price);
              }
        }
        // console.log(totalPrice)
        return totalPrice;
    } 
    catch (error) 
    {
      console.error(error);
    }
  }

module.exports =  calculateTotalPrice;