import ForeignIndividualFullRegistration from "./ForeignIndividualFullRegistration.jsx";
import ForeignIndividualCreditFacilityAgreement from "./ForeignIndividualCreditFacilityAgreement.jsx";
import ForeignIndividualSchedule1 from "./ForeignIndividualSchedule1.jsx";
import ForeignIndividualSchedule2 from "./ForeignIndividualSchedule2.jsx";
import UploadSignaturesForeignIndividual from "./UploadSignaturesForeignIndividual.jsx";

export default function ForeignIndividualUnifiedForm(props) {
  const {
    form,
    update,
    busy,
    principalSig,
    setPrincipalSig,
    jointSig,
    setJointSig,
    secondJointSig,
    setSecondJointSig,
    clientSig,
    setClientSig,
    advisorSig,
    setAdvisorSig,
    liAgentSignature,
    setLiAgentSignature,
    agreementWitness1Sig,
    setAgreementWitness1Sig,
    agreementWitness2Sig,
    setAgreementWitness2Sig,
    cfPrincipalSig,
    setCfPrincipalSig,
    cfFirmSig,
    setCfFirmSig,
    cfWitness1Sig,
    setCfWitness1Sig,
    cfWitness2Sig,
    setCfWitness2Sig,
  } = props;

  const jointEnabled = !!form?.fiClientRegistration?.jointApplicant?.enabled;
  const secondJointEnabled = !!form?.fiClientRegistration?.secondJointApplicant?.enabled;

  return (
    <div className="space-y-6">
      <ForeignIndividualFullRegistration form={form} update={update} busy={busy} />

      <ForeignIndividualCreditFacilityAgreement
        form={form}
        update={update}
        busy={busy}
        onPrev={() => {}}
        onNext={() => {}}
        cfPrincipalSig={cfPrincipalSig}
        setCfPrincipalSig={setCfPrincipalSig}
        cfFirmSig={cfFirmSig}
        setCfFirmSig={setCfFirmSig}
        cfWitness1Sig={cfWitness1Sig}
        setCfWitness1Sig={setCfWitness1Sig}
        cfWitness2Sig={cfWitness2Sig}
        setCfWitness2Sig={setCfWitness2Sig}
      />

      <ForeignIndividualSchedule1 form={form} update={update} busy={busy} />
      <ForeignIndividualSchedule2 form={form} update={update} busy={busy} />

      <UploadSignaturesForeignIndividual
        busy={busy}
        jointEnabled={jointEnabled}
        secondJointEnabled={secondJointEnabled}
        principalSig={principalSig}
        setPrincipalSig={setPrincipalSig}
        jointSig={jointSig}
        setJointSig={setJointSig}
        secondJointSig={secondJointSig}
        setSecondJointSig={setSecondJointSig}
        clientSig={clientSig}
        setClientSig={setClientSig}
        advisorSig={advisorSig}
        setAdvisorSig={setAdvisorSig}
        liAgentSignature={liAgentSignature}
        setLiAgentSignature={setLiAgentSignature}
        agreementWitness1Sig={agreementWitness1Sig}
        setAgreementWitness1Sig={setAgreementWitness1Sig}
        agreementWitness2Sig={agreementWitness2Sig}
        setAgreementWitness2Sig={setAgreementWitness2Sig}
      />
    </div>
  );
}
