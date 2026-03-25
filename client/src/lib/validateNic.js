// Sri Lanka NIC validation (format-level)
// Old NIC: 9 digits + V/v/X/x  (e.g., 123456789V)
// New NIC: 12 digits          (e.g., 200012345678)

export function isValidSriLankaNIC(nicRaw) {
  if (!nicRaw) return false;

  const nic = String(nicRaw).trim();

  const oldNic = /^[0-9]{9}[vVxX]$/;   // 9 digits + V/X
  const newNic = /^[0-9]{12}$/;        // 12 digits

  return oldNic.test(nic) || newNic.test(nic);
}
