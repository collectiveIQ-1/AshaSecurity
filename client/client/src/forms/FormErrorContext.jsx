import { createContext, useContext } from "react";

/**
 * FormErrorContext
 * - errors: { [path: string]: string }
 * Use: <FormErrorProvider errors={errors}> ... </FormErrorProvider>
 */
const Ctx = createContext({ errors: {} });

export function FormErrorProvider({ errors = {}, children }) {
  return <Ctx.Provider value={{ errors }}>{children}</Ctx.Provider>;
}

export function useFormErrors() {
  return useContext(Ctx).errors || {};
}
