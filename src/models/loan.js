//MODELO DE LOAN CON LOS ATRIBUTOS NECESARIOS EN EL PROCESO DE REFINANCIAMIENTO Y PAGO SOSTENIDO
class Loan {
    constructor(accountid, encodedKey, assignedBranchKey, originalAccountKey, accountState, accountSubState, firstRepaymentDate, expectedDisbursementDate, lastSetToArrearsDate,nextBranchKey,initialBranchKey,pmtCounter) {
      this.accountid = accountid;
      this.encodedKey = encodedKey;
      this.assignedBranchKey = assignedBranchKey;
      this.originalAccountKey = originalAccountKey;
      this.accountState = accountState;
      this.accountSubState = accountSubState;
      this.firstRepaymentDate = firstRepaymentDate;
      this.expectedDisbursementDate = expectedDisbursementDate;
      this.lastSetToArrearsDate = lastSetToArrearsDate;
      this.nextBranchKey = nextBranchKey;
      this.initialBranchKey = initialBranchKey;
      this.pmtCounter = pmtCounter;
    }    
  }
  module.exports = Loan; 