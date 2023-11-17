const loanService = require('../services/loanService');
const MAX_PAYMENTS = process.env.MAX_PAYMENTS || 3;

let pmtmw = {
    runPaymentProcess: async function(data) {
        console.log('\n'+"**********START CONSECUTIVE PAYMENTS PROCESS********");
        const trigger = data;          
        let paycounter = trigger.paycounter;        

        //VALIDA EL CONTADOR DE PAGOS
        if(paycounter < MAX_PAYMENTS)
            await updateLoan(++paycounter,trigger); 
        else 
            console.log("Loan ID: " + trigger.accountid + " is already on STAGE 1.");

        console.log("**********END CONSECUTIVE PAYMENTS PROCESS********");
    }
};
module.exports = pmtmw;

//ACTUALIZA EL CONTADOR DE PAGOS Y SUCURSAL DEL PRESTAMO
async function updateLoan(paycounter,trigger){
    console.log("**********UPDATE LOAN CFS********");

    let jsonBody = '[{"op": "add","path": "/_Uala_Loan_Accounts/pay_counter","value": '+ paycounter +'}';

    if(paycounter == MAX_PAYMENTS)
        jsonBody += ',{"op": "add","path": "/assignedBranchKey","value": "'+trigger.initialbranchkey+'"}';    

    jsonBody += ']';

    const res = await loanService.patchLoan(trigger.accountid,jsonBody);
    
    if(res.status >= 200 && res.status <= 299)
        console.log("Loan ID: " + trigger.accountid + " succesfully updated.");
    else
        console.log(res.data);
}