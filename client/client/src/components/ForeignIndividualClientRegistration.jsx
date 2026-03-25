import { Field } from "./Field.jsx";
import { Input } from "./Input.jsx";
import { Select } from "./Select.jsx";

const titleOptions = [
  { label: "Select title", value: "" },
  { label: "Mr.", value: "Mr" },
  { label: "Mrs.", value: "Mrs" },
  { label: "Ms.", value: "Ms" },
  { label: "Miss.", value: "Miss" },
  { label: "Dr.", value: "Dr" },
  { label: "Prof.", value: "Prof" },
  { label: "Rev.", value: "Rev" },
  { label: "Ven.", value: "Ven" },
];

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className="mt-2 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

export default function ForeignIndividualClientRegistration({ form, update, busy }) {
  const principal = form?.fiClientRegistration?.principal || {};

  const setName = (raw) => {
    const value = raw ?? "";
    update("fiClientRegistration.principal.name", value);
    update("fiClientRegistration.principal.namesByInitials", value);
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-zinc-200/80 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-zinc-200/60 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-zinc-300/40 blur-3xl" />
      </div>

      <div className="relative border-b border-zinc-200/80 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-zinc-600">
              CLIENT REGISTRATION
            </div> */}
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Foreign Individual 
            </h2>
            {/* <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              This section is now simplified to a clean premium card with only the required identity fields.
            </p> */}
          </div>

          {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[390px]">
            <StatCard label="Layout" value="Minimal" />
            <StatCard label="Fields" value="Title + Name" />
            <StatCard label="Experience" value="Clean UI" />
          </div> */}
        </div>
      </div>

      <div className="relative px-6 py-6 sm:px-8 sm:py-8">
        <div className="rounded-[28px] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="flex flex-col gap-2 border-b border-zinc-200/80 pb-5">
            {/* <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Principal applicant
            </div> */}
            <h3 className="text-lg font-semibold text-zinc-900">Principal applicant</h3>
            {/* <p className="text-sm text-zinc-600">
              Enter only the title and the full name for the foreign individual registration form.
            </p> */}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Title">
              <Select
                path="fiClientRegistration.principal.title"
                value={principal?.title || ""}
                onChange={(e) => update("fiClientRegistration.principal.title", e.target.value)}
                disabled={busy}
              >
                {titleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Name">
              <Input
                path="fiClientRegistration.principal.name"
                value={principal?.name || principal?.namesByInitials || ""}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                disabled={busy}
              />
            </Field>
          </div>

          {/* <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-4 text-sm text-zinc-600">
            The rest of the old Foreign Individual fields are removed from the screen, while keeping the form submission structure compatible with your existing flow.
          </div> */}
        </div>
      </div>
    </div>
  );
}
