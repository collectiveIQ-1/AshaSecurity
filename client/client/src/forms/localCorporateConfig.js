// forms/localCorporateConfig.js
// ✅ Local -> Corporate onboarding (NEW single form)

const emptyDirector = () => ({
  fullName: "",
  nicOrPassport: "",
  designation: "",
  address: "",
});

const emptyBeneficialOwner = () => ({
  name: "",
  nicOrPassport: "",
  dob: "",
  currentAddress: "",
  sourceOfBeneficialOwnership: "",
  pep: "",
});


const emptyLcBeneficialOwnershipOwner = () => ({
  name: "",
  nicOrPassport: "",
  dob: "",
  currentAddress: "",
  sourceOfBeneficialOwnership: "",
  pep: false,
});

export const localCorporateSteps = [
  // Same UX as Local Individual: no stepper/progress UI.
  { key: "clientRegistration", title: "Client Registration" },
];

export const localCorporateEmpty = {
  clientRegistration: {
    // Per LocalCorporateNew.docx
    companyName: "",
    telNos: "",
    faxNos: "",
    email: "",
    website: "",

    registeredAddress: "",
    correspondenceAddress: "",

    businessRegNo: "",
    dateOfIncorporation: "",
    placeOfIncorporation: "",
    natureOfBusiness: "",

    bankDetails: {
      bank: "",
      branch: "",
      accountType: "",
      accountNo: "",
    },

    majorShareholders: "", // up to 10 (free text)
    boardResolutionDetails: "", // free text
    presentBrokers: "",

    mailing: {
      mailingInstruction: "", // post / deliver / hold
      chequesInstruction: "", // keep at office / posted
      notes: "",
    },

    correspondenceContact: {
      name: "",
      telNo: "",
      faxNo: "",
    },

    clientIntroducedBy: "",

    officeUseOnly: {
      applicationReceivedOn: "",
      date: "",
      advisorsCode: "",
    },

    staffDeclaration: {
      investmentAdvisorName: "",
      staffName: "",
      staffDate: "",
      staffSignature: "",
    },

    declaration: {
      weName: "",
      weBrNo: "",
      weOf: "",
      agreedToRiskDisclosure: false,
      agreedToUndertaking: false,
    },

    // ✅ Form 2A - KNOW YOUR CUSTOMER (KYC) PROFILE (as per provided Word section)
    kycProfile: {
      natureOfBusiness: "",
      expectedInvestmentPerAnnum: "", // one of the predefined bands
      sourceOfFunds: [], // multi-select
      sourceOfFundsOther: "",
      fatcaUSPerson: "", // Yes/No
      fatcaNote: "",
      pep: "", // Yes/No
      pepDetails: "",
      otherConnectedBusinesses: "",
      authorizedPerson: {
        name: "",
        designation: "",
        telephone: "",
        fax: "",
        mobile: "",
        email: "",
      },
      otherRemarks: "",
    },

    // Client Agreement block used inside the Local Corporate single-page form
    clientAgreement: {
      date: { day: "", month: "", year: "" },
      parties: [
        { name: "", idNo: "", address: "" },
        { name: "", idNo: "", address: "" },
        { name: "", idNo: "", address: "" },
      ],
      accepted: false,
    },

    creditFacility: {
      date: { day: "", month: "", year: "" },
      client: { name: "", nicCds: "", address: "", includeTheSaid: "" },
      execution: {
        name: "",
        date: "",
        month: "",
        year: "",
        witness1: { name: "", nic: "" },
        witness2: { name: "", nic: "" },
      },
      accepted: false,
    },

    privacyConsent: {
      consentDataProcessing: false,
      consentThirdPartySharing: false,
      consentMarketing: false,
    },

    schedule1: {
      employeeName: "",
      clientNames: "",
      signedBy: "",
      name: "",
      designation: "",
      date: "",
      nicNo: "",
    },

    schedule2: {
      party1Name: "",
      party1Id: "",
      party1Address: "",
      party2Name: "",
      party2Id: "",
      party2Address: "",
      party3Name: "",
      party3Id: "",
      party3Address: "",
      explainedBy: "",
      date: "",
    },

    beneficialOwnershipForm: {
      customerIdentification: {
        naturalPersonName: "",
        naturalPersonDesignation: "",
        legalPersonName: "",
        legalPersonRegNo: "",
        legalPersonAddress: "",
        arrangementName: "",
        arrangementDeedNo: "",
        arrangementTrustee: "",
        arrangementAddress: "",
      },
      declaration: {
        isBeneficialOwner: false,
        isNotBeneficialOwner: false,
      },
      beneficialOwners: Array.from({ length: 5 }, emptyLcBeneficialOwnershipOwner),
      authorizedCustomer: {
        name: "",
        nicOrPassport: "",
        dob: "",
        verificationText: "",
      },
      afiOfficial: {
        name: "",
        title: "",
        date: "",
      },
      paymentAuthorization: {
        date: "",
        holdCreditBalance: false,
        settleOnDueDate: false,
        normalSettlement: false,
      },
    },

    // (Not part of the updated Declaration block, kept for backward compatibility)
    servicesProvided: "",
    notes: "",
  },

  accepted: false,
};
