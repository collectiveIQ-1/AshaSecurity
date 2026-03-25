export default function ForeignCorporateAdditionalRequirements() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-200">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* TITLE */}
        <h1 className="text-center text-lg font-semibold tracking-wide text-zinc-900 dark:text-white">
          ADDITIONAL REQUIREMENT FOR CORPORATE BODIES
        </h1>

        {/* CONTENT */}
        <div className="space-y-5 text-sm leading-relaxed">

          <ul className="list-disc space-y-3 pl-6">
            <li>
              Names, Addresses, Passport Number number and Occupations of Directors as at date.
              ( If the Company is listed in a Stock exchange only the names should be given.
              Proof of such listing should be submitted in that event )
            </li>

            <li>
              If the directors are also a company, the following information on such Director
              company should be given:
              <ol className="list-[lower-roman] space-y-2 pl-8 mt-2">
                <li>Name of the Company</li>
                <li>Date of Incorporation</li>
                <li>Place of Incorporation</li>
                <li>Registered Address</li>
              </ol>
            </li>

            <li>
              Names, Passport Number and Address of top 10 share holders list as at date.
              ( Not applicable if the Company is listed in Stock Exchange )
            </li>

            <li>
              Name of person/s authorized to give instructions with a copy of the Power of
              Attorney or board resolution
            </li>

            <li>
              Certified Copies of the following documents
              <ol className="list-decimal space-y-2 pl-8 mt-2">
                <li>Memorandum &amp; Articles of Association or corresponding Document.</li>
                <li>Certificate of Incorporation</li>
                <li>Certified extract of the resolution to open the CDS account</li>
                <li>
                  Certified extract of the resolution to who has authorize to give instruction
                  on behalf of the company
                </li>
              </ol>
            </li>

            <li>Certified copy of letter of Commence of business</li>
          </ul>

          {/* SUB TITLE */}
          <h2 className="pt-6 text-sm font-semibold text-zinc-900 dark:text-white">
            Certification for Non Resident Applicant
          </h2>

          <ul className="list-disc space-y-3 pl-6">
            <li>
              By the Company Registry where the documents were originally issued
              ( applicable for Corporate bodies )
            </li>

            <li>
              By a Sri Lankan diplomatic officer or Sri Lankan consular officer in the country
              where the documents were originally issued or.
            </li>

            <li>
              By a Solicitor, Attorney-at-law, Notary Public, practicing in the country where
              the applicant resides
            </li>

            <li>Proof of SIERA account details</li>
            <li>Copy of Passport of Directors</li>
          </ul>

        </div>
      </div>
    </div>
  );
}
