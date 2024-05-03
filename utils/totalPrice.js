const prisma = require('../db')

//Total price calculator function with productIds as an input array.
async function calculateTotalPrice(productIds){
    try 
    {
        //get every product through a for loop and add its price to an aggregate
        for (const productId of productIds) {
            const product = await prisma.product.findUnique({
                where: {
                id: productId,
                },
                select: {
                price: true,
                },
            });
            if (product) {
                totalPrice += product.price;
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

  export default calculateTotalPrice;