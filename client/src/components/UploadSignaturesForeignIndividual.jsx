// src/components/UploadSignaturesLocalIndividual.jsx

import FileUpload from "./FileUpload.jsx";

function SectionHeader() {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/60">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Upload the Signatures
          </div>
          {/* <div className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
            Please upload clear signature images (scan / photo). Use a dark ink signature on a plain white background.
          </div> */}
        </div>

        {/* <div className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Best format: PNG / JPG
        </div> */}
      </div>

      {/* <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 text-xs sm:text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/25 dark:text-zinc-300">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">1</span>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Sign on paper</div>
            <div className="mt-0.5">Use a clean white sheet and sign with dark ink.</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">2</span>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Capture clearly</div>
            <div className="mt-0.5">Take a straight photo (no blur, no shadows).</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">3</span>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100">Upload below</div>
            <div className="mt-0.5">You can replace any file if you need to update.</div>
          </div>
        </div>
      </div> */}
      
    </div>
  );
}

export default function UploadSignaturesForeignIndividual({
  busy,
  jointEnabled,
  secondJointEnabled,

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
}) {
  return (
    <div className="space-y-4">
      <SectionHeader />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FileUpload
          label="Upload Principal Applicant Signature"
          accept="image/*"
          file={principalSig}
          setFile={setPrincipalSig}
          path="principalSig"
          hint={busy ? "" : "Required"}
        />

        {jointEnabled ? (
          <FileUpload
            label="Upload 1st Joint Applicant Signature"
            accept="image/*"
            file={jointSig}
            setFile={setJointSig}
            path="jointSig"
            hint={busy ? "" : "Optional"}
          />
        ) : null}

        {secondJointEnabled ? (
          <FileUpload
            label="Upload 2nd Joint Applicant Signature"
            accept="image/*"
            file={secondJointSig}
            setFile={setSecondJointSig}
            path="secondJointSig"
            hint={busy ? "" : "Optional"}
          />
        ) : null}

        <FileUpload
          label="Upload Client Signature"
          accept="image/*"
          file={clientSig}
          setFile={setClientSig}
          path="clientSig"
          hint={busy ? "" : "Required"}
        />

        <FileUpload
          label="Upload Advisor Signature"
          accept="image/*"
          file={advisorSig}
          setFile={setAdvisorSig}
          path="advisorSig"
          hint={busy ? "" : "Optional"}
        />

        <FileUpload
          label="Upload Authorizer Signature"
          accept="image/*"
          file={liAgentSignature}
          setFile={setLiAgentSignature}
          path="liAgentSignature"
          hint={busy ? "" : "Optional"}
        />

        <FileUpload
          label="Upload Witness1 Signature"
          accept="image/*"
          file={agreementWitness1Sig}
          setFile={setAgreementWitness1Sig}
          path="agreementWitness1Sig"
          hint={busy ? "" : "Optional"}
        />

        <FileUpload
          label="Upload Witness2 Signature"
          accept="image/*"
          file={agreementWitness2Sig}
          setFile={setAgreementWitness2Sig}
          path="agreementWitness2Sig"
          hint={busy ? "" : "Optional"}
        />
      </div>

      {/* <div className="rounded-2xl border border-zinc-200 bg-white/50 px-4 py-3 text-xs sm:text-sm text-zinc-700 shadow-soft dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
        Tip: If your signature looks too light, re-capture with better lighting or increase contrast before uploading.
      </div> */}
    </div>
  );
}
