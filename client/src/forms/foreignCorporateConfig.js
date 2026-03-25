// client/src/forms/foreignCorporateConfig.js
// Foreign -> Corporate (single-page form aligned to Local Corporate UI)

const emptyFcBeneficialOwnershipOwner = () => ({
  name: "",
  nicOrPassport: "",
  dob: "",
  currentAddress: "",
  sourceOfBeneficialOwnership: "",
  pep: false,
});

export const foreignCorporateSteps = [
  { key: "fcClientRegistration", title: "Client Registration" },
];

export const foreignCorporateEmpty = {
  fcClientRegistration: {
    companyName: "",
    telNos: "",
    faxNos: "",
    emailAddress: "",
    website: "",
    registeredAddress: "",
    correspondenceAddress: "",
    businessRegNo: "",
    dateOfIncorporation: "",
    placeOfIncorporation: "",
    natureOfBusiness: "",
    bankDetails: { bank: "", branch: "", accountType: "", accountNo: "" },
    majorShareholders: "",
    boardResolutionDetails: "",
    presentBrokers: "",
    mainProcess: { holdForCollections: false, chequesKeptAtOffice: false },
    mailing: { mailingInstruction: "", chequesInstruction: "", notes: "" },
    correspondenceContact: { name: "", telNo: "", faxNo: "" },
    clientIntroducedBy: "",
    officeUseOnly: { applicationReceivedOn: "", date: "", advisorsCode: "" },
    staffDeclaration: { investmentAdvisorName: "", staffName: "", staffDate: "", staffSignature: "" },
    declaration: { weName: "", weBrNo: "", weOf: "", agreedToRiskDisclosure: false, agreedToUndertaking: false },
    para1: "",
    para2: "",
    kycProfile: {
      natureOfBusiness: "",
      expectedInvestmentPerAnnum: "",
      sourceOfFunds: [],
      sourceOfFundsOther: "",
      fatcaUSPerson: "",
      fatcaNote: "",
      pep: "",
      pepDetails: "",
      otherConnectedBusinesses: "",
      authorizedPerson: { name: "", designation: "", telephone: "", fax: "", mobile: "", email: "" },
      otherRemarks: "",
    },
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
      execution: { name: "", date: "", month: "", year: "", witness1: { name: "", nic: "" }, witness2: { name: "", nic: "" } },
      accepted: false,
    },
    privacyConsent: { consentDataProcessing: false, consentThirdPartySharing: false, consentMarketing: false },
    schedule1: { employeeName: "", clientNames: "", signedBy: "", name: "", designation: "", date: "", nicNo: "" },
    schedule2: {
      party1Name: "", party1Id: "", party1Address: "",
      party2Name: "", party2Id: "", party2Address: "",
      party3Name: "", party3Id: "", party3Address: "",
      explainedBy: "", date: "",
    },
    beneficialOwnershipForm: {
      customerIdentification: {
        naturalPersonName: "", naturalPersonDesignation: "", legalPersonName: "", legalPersonRegNo: "", legalPersonAddress: "",
        arrangementName: "", arrangementDeedNo: "", arrangementTrustee: "", arrangementAddress: "",
      },
      declaration: { isBeneficialOwner: false, isNotBeneficialOwner: false },
      beneficialOwners: Array.from({ length: 5 }, emptyFcBeneficialOwnershipOwner),
      authorizedCustomer: { name: "", nicOrPassport: "", dob: "", verificationText: "" },
      afiOfficial: { name: "", title: "", date: "" },
      paymentAuthorization: { date: "", holdCreditBalance: false, settleOnDueDate: false, normalSettlement: false },
    },
    servicesProvided: "",
    notes: "",
  },
  accepted: false,
};
