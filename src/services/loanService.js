const axios = require('axios');

//PROCESA LAS LLAMADAS A LA API DE MAMBU DE LOANS - GET/PATCH/DISBURSE
var loanService = {
    getLoan : async (loanKey) => {
        try{
            const res = await axios({
                method: "GET",
                url: `https://mbucarlosn.sandbox.mambu.com/api/loans/`+loanKey,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.mambu.v2+json", 
                    "apikey":""+process.env.MAMBU_APIKEY+""
                },
                params: {
                    detailsLevel: "FULL",
                }, 
            }); 
            return res;
        }
        catch(err){
            return err.response;
        }              
    },
    patchLoan : async (loanKey,jsonBody) => {
        try{
            const res = await axios({
                method: "PATCH",
                url: `https://mbucarlosn.sandbox.mambu.com/api/loans/`+loanKey,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.mambu.v2+json", 
                    "apikey":""+process.env.MAMBU_APIKEY+""
                },
                data: jsonBody                 
            }); 
            return res;
        }
        catch(err){
            return err.response;
        }              
    },
    disburseLoan : async (loanKey,jsonBody) => {
        try{
            const res = await axios({
                method: "POST",
                url: `https://mbucarlosn.sandbox.mambu.com/api/loans/`+loanKey+`/disbursement-transactions`,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.mambu.v2+json", 
                    "apikey":""+process.env.MAMBU_APIKEY+""
                },
                data: jsonBody                 
            }); 
            return res;
        }
        catch(err){
            return err.response;
        }              
    }
};
module.exports = loanService;