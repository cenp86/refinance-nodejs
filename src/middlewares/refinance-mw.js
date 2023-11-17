const Loan =  require("../models/loan");
let loanService = require('../services/loanService');

let refinancemw = {
    runRefinanceProcess: async function(data) {
        console.log('\n'+"**********START REFINANCING PROCESS********");

        const trigger = data;
        let newLoan = null;
        let originalLoan = null;
        let daysInArrears = 0;
        let success = false;

        newLoan = await getNewLoanDetails(trigger);

        if(newLoan != null && newLoan.accountSubState == "PARTIALLY_DISBURSED"){
            originalLoan = await getOriginalLoanDetails(newLoan.originalAccountKey);
            if(originalLoan != null)
            {
                daysInArrears = computeNewLoanCFs(trigger,originalLoan);
                success = await updateNewLoanCFs(trigger,newLoan,daysInArrears);
                if(success)
                    await disburseNewLoan(newLoan);
            }
        }
        else if(newLoan != null && newLoan.accountSubState != "PARTIALLY_DISBURSED")
            console.log("Loan ID: " + newLoan.accountid + " already disbursed.");
        
        console.log("**********END REFINANCING PROCESS********");                 
    }
};
module.exports = refinancemw;

//CONSULTA EL DETALLE DEL PRESTAMO REFINANCIADO
async function getNewLoanDetails(trigger){
    console.log("**********GET NEW LOAN DETAILS********");

    const res = await loanService.getLoan(trigger.accountid);    
    
    if(res.status >= 200 && res.status <= 299)
    {
        const encodedKey = res.data.encodedKey || 0;
        const assignedBranchKey = res.data.assignedBranchKey || 0;
        const originalLoanKey = res.data.originalAccountKey || 0;
        const accountState = res.data.accountState || 0;    
        const accountSubState = res.data.accountSubState || 0;       
        const firstRepaymentDate = res.data.disbursementDetails.firstRepaymentDate || 0;
        const expectedDisbursementDate = res.data.disbursementDetails.expectedDisbursementDate || 0;
        
        const newLoan = new Loan(trigger.accountid,encodedKey,assignedBranchKey,originalLoanKey,accountState,accountSubState,firstRepaymentDate,expectedDisbursementDate,0,0,0,0);    
        
        return newLoan; 
    }        
    else
        console.log(res.data);    
}

//CONSULTA LA INFORMACION DEL PRESTAMO ORIGINAL
async function getOriginalLoanDetails(originalLoanKey){
    console.log("**********GET ORIGINAL LOAN DETAILS********");

    const res = await loanService.getLoan(originalLoanKey);

    if(res.status >= 200 && res.status <= 299){
        const accountid = res.data.id || 0;
        const lastSetToArrearsDate = res.data.lastSetToArrearsDate || 0;
        const originalLoanBranchKey = res.data.assignedBranchKey || 0; 
        const accountState = res.data.accountState || 0;    
        const accountSubState = res.data.accountSubState || 0;       
        
        const originalLoan = new Loan(accountid,originalLoanKey,originalLoanBranchKey,0,accountState,accountSubState,0,0,lastSetToArrearsDate,0,0,0);            

        return originalLoan;
    }        
    else 
        console.log(res.data);    
}

//CALCULA LA CANTIDAD DE DIAS DE ATRASO DEL PRESTAMO ORIGINAL
function computeNewLoanCFs(trigger,originalLoan){
    console.log("**********COMPUTE DAYS IN ARREARS********");  
    
    return Math.ceil((new Date(trigger.datetime).getTime() - new Date(originalLoan.lastSetToArrearsDate).getTime()) / (1000 * 3600 * 24)) + 1;
}

//ACTUALIZA LOS CFS DEL PRESTAMO REFINANCIADO
async function updateNewLoanCFs(trigger,newLoan,daysInArrears){
    console.log("**********UPDATE NEW LOAN CFS********");
    
    const jsonBody = '[{"op":"add","path":"/_Uala_Loan_Accounts/pay_counter","value":"0"},{"op":"add","path":"/_Uala_Loan_Accounts/days_in_arrears","value":'+daysInArrears+'},{"op":"add","path":"/assignedBranchKey","value":"'+trigger.nextbranchkey+'"}]';    
    const res = await loanService.patchLoan(newLoan.encodedKey,jsonBody);
    
    if(res.status >= 200 && res.status <= 299)
        return true;
    else
        console.log(res.data);
}

//REALIZA EL DESEMBOLSO DEL PRESTAMO REFINANCIADO
async function disburseNewLoan(newLoan){
    console.log("**********DISBURSE NEW LOAN********");

    const jsonBody = '{"valueDate":"'+newLoan.expectedDisbursementDate+'","firstRepaymentDate":"'+newLoan.firstRepaymentDate+'","notes": "Desembolso automático proceso de refinanciamiento y pago sostenido"}';
    const res = await loanService.disburseLoan(newLoan.encodedKey,jsonBody);

    if(res.status >= 200 && res.status <= 299)
        console.log("Loan ID: " + newLoan.accountid + " successfully disbursed.");
    else
        console.log(res.data);
}