const axios = require("axios");

const createCustomOrder = async (shiprocketToken, orderData)=>{
    const headers = {
        'Authorization' : 'Bearer ' + shiprocketToken,
    };
    try{
        axios.post(`https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`,orderData,{headers})
            .then((data)=>{
                return data.data;
                //Save 'data.data.order ID' as we will use this in future API calls.
            })
            .catch((error)=>{
                console.log(error)
                return "SERVER ERROR"
                //error has message and status code
            })
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {createCustomOrder};