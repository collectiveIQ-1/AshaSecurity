// Foreign Individual mirrors the Local Individual single-form layout,
// but keeps its own FI-specific root key and state tree.

export const foreignIndividualSteps = [
  { key: "fiClientRegistration", title: "Foreign Individual Registration" },
];

export const foreignIndividualEmpty = {
  fiClientRegistration: {
    principal: {
      title: "",
      name: "",
      surname: "",
      telHome: "",
      telOffice: "",
      faxHome: "",
      faxOffice: "",
      mobile: "",
      email: "",
      permanentAddress: "",
      correspondenceAddress: "",
      identityNo: "", // NIC / Passport / Driving License
      identityFront: null,
      identityBack: null,
      cdsAccountNo: "",
      dateOfIssue: "",
      utilityBill: null,
      occupation: "",
      employerAddress: "",
      employerContactNo: "",
      bank: "",
      branch: "",
      accountType: "",
      accountNo: "",
      stockMarketExperience: "", // Yes/No
      presentBrokers: "",
      mailingInstruction: "", // Office / Home / Other
      chequesInstruction: "", // Posted / Collect / Do not prepare
      contactNotes: "", // Post / Collect / Email
      riskAcknowledged: false,
    },

    jointApplicant: {
      enabled: false,
      title: "",
      name: "",
      surname: "",
      telHome: "",
      telOffice: "",
      faxHome: "",
      faxOffice: "",
      mobile: "",
      email: "",
      permanentAddress: "",
      correspondenceAddress: "",
      identityNo: "",
      identityFront: null,
      identityBack: null,
    },

    secondJointApplicant: {
      enabled: false,
      name: "",
      resAddress: "",
      occupation: "",
      officeAddress: "",
      identityNo: "",
      identityFront: null,
      identityBack: null,
      dateOfIssue: "",
      nationality: "",
      tel: "",
      fax: "",
    },

    investmentDecision: {
      type: "", // Discretionary / Non Discretionary
      discretionaryLetter: null,
    },

    staffDeclaration: {
      advisorName: "",
      explainedRisk: false,
    },

    authorizedInstructions: {
      nameAndAddress: "",
      agentSignature: null,
      agentCode: "",
    },

    officeUseOnly: {
      applicationReceivedOn: "",
      advisorsName: "",
      advisorsSignature: null,
    },


    clientDeclaration: {
      declarationName: "",
      declarationNicNumbers: "",
      declarationCdsAccountNo: "",
      declarationAddress: "",
      // Remarks section (as per new word/PDF layout)
      // NOTE: We keep `remarks` for backward compatibility even if the UI no longer
      // shows a big textarea.
      remarks: "",
      // Stored as "Yes" (checked) or "" (unchecked)
      clientVisitedOffice: "",
      visitedOfficeOn: "",
      staffMemberName: "",
      authorizeName: "",
    },

    clientAgreement: {
      date: { day: "", month: "", year: "" },
      // Parties are auto-filled from Principal / Joint applicants, but can be edited if needed.
      parties: [
        { name: "", idNo: "", address: "" }, // (1) Principal
        { name: "", idNo: "", address: "" }, // (2) 1st Joint (if enabled)
        { name: "", idNo: "", address: "" }, // (3) 2nd Joint (if enabled)
      ],
    },




    kycProfile: {
      documentsProvided: {
        forKyc: {
          nationalIdentityCard: { main: false, joint1: false, joint2: false },
          passport: { main: false, joint1: false, joint2: false },
          drivingLicense: { main: false, joint1: false, joint2: false },
          drivingLicenseAffidavitConfirmed: false,
        },
        proofOfResidency: {
          nationalIdentityCard: { main: false, joint1: false, joint2: false },
          bankOrCreditCardStatement: { main: false, joint1: false, joint2: false },
          telephoneBill: { main: false, joint1: false, joint2: false },
          electricityWaterBill: { main: false, joint1: false, joint2: false },
          registeredLeaseAgreement: { main: false, joint1: false, joint2: false },
          gramasevakaCertificate: { main: false, joint1: false, joint2: false },
          plantationSuperintendentLetter: { main: false, joint1: false, joint2: false },
          anyOther: { main: false, joint1: false, joint2: false, specify: "" },
        },
        noteWithinMonths: 3,
      },

      residencyAddressStatus: {
        owner: { main: false, joint1: false, joint2: false },
        withParents: { main: false, joint1: false, joint2: false },
        leaseRent: { main: false, joint1: false, joint2: false },
        friendsRelatives: { main: false, joint1: false, joint2: false },
        boardLodging: { main: false, joint1: false, joint2: false },
        official: { main: false, joint1: false, joint2: false },
        otherPlaces: { main: false, joint1: false, joint2: false, specify: "" },
      },

      dualCitizenship: {
        main: [
          { country: "", passportNo: "" },
          { country: "", passportNo: "" },
          { country: "", passportNo: "" },
        ],
        joint1: [
          { country: "", passportNo: "" },
          { country: "", passportNo: "" },
          { country: "", passportNo: "" },
        ],
        joint2: [
          { country: "", passportNo: "" },
          { country: "", passportNo: "" },
          { country: "", passportNo: "" },
        ],
      },

      // Used by the Dual-citizenship table UI (PDF-style layout).
      // Each row selects which holder the Country/Passport values belong to.
      dualCitizenshipSelection: ["", "", ""],

      fatcaUsPerson: { main: "", joint1: "", joint2: "" }, // Yes / No / ""
      employment: {
        main: {
          status: "", // Employed / Self Employed
          occupationNature: "",
          businessOrganizationName: "",
          officeAddress: "",
          telephone: "",
          fax: "",
          email: "",
        },
        joint1: {
          status: "",
          occupationNature: "",
          businessOrganizationName: "",
          officeAddress: "",
          telephone: "",
          fax: "",
          email: "",
        },
        joint2: {
          status: "",
          occupationNature: "",
          businessOrganizationName: "",
          officeAddress: "",
          telephone: "",
          fax: "",
          email: "",
        },
      },

      expectedInvestmentPerAnnum: { main: "", joint1: "", joint2: "" },

      sourceOfFunds: {
        main: {
          salaryProfitIncome: false,
          investmentProceedsSavings: false,
          salesBusinessTurnover: false,
          contractProceeds: false,
          salesOfPropertyAssets: false,
          gifts: false,
          donationsCharities: false,
          commissionIncome: false,
          familyRemittance: false,
          exportProceeds: false,
          membershipContribution: false,
          others: false,
          othersSpecify: "",
        },
        joint1: {
          salaryProfitIncome: false,
          investmentProceedsSavings: false,
          salesBusinessTurnover: false,
          contractProceeds: false,
          salesOfPropertyAssets: false,
          gifts: false,
          donationsCharities: false,
          commissionIncome: false,
          familyRemittance: false,
          exportProceeds: false,
          membershipContribution: false,
          others: false,
          othersSpecify: "",
        },
        joint2: {
          salaryProfitIncome: false,
          investmentProceedsSavings: false,
          salesBusinessTurnover: false,
          contractProceeds: false,
          salesOfPropertyAssets: false,
          gifts: false,
          donationsCharities: false,
          commissionIncome: false,
          familyRemittance: false,
          exportProceeds: false,
          membershipContribution: false,
          others: false,
          othersSpecify: "",
        },
      },

      otherConnectedBusinesses: { main: "", joint1: "", joint2: "" },

      pep: {
        main: {
          domesticPublicFunction: "",
          domesticExplain: "",
          foreignPublicFunction: "",
          foreignExplain: "",
          relatedToPep: "",
          relatedExplain: "",
          closelyConnected: "",
          closelyExplain: "",
        },
        joint1: {
          domesticPublicFunction: "",
          domesticExplain: "",
          foreignPublicFunction: "",
          foreignExplain: "",
          relatedToPep: "",
          relatedExplain: "",
          closelyConnected: "",
          closelyExplain: "",
        },
        joint2: {
          domesticPublicFunction: "",
          domesticExplain: "",
          foreignPublicFunction: "",
          foreignExplain: "",
          relatedToPep: "",
          relatedExplain: "",
          closelyConnected: "",
          closelyExplain: "",
        },
      },

      riskCategorizationOfficeUse: { main: "", joint1: "", joint2: "" }, // L / M / H
      authorizedToGiveInstructions: "",
      otherRemarksNotes: "",
    },


    clientDeclarationHeader: {
      declarantName: "",
      nicNos: "",
      cdsAccountNo: "",
      address: "",
    },

    privacyConsent: {
      consentDataProcessing: false,
      consentThirdPartySharing: false,
      consentMarketing: false,
    },
  },
};
