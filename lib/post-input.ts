export type PublishedInput = boolean | "true" | "false";

export function isPublishedInput(value: unknown): value is PublishedInput {
  return (
    value === true ||
    value === false ||
    value === "true" ||
    value === "false"
  );
}

export function normalizePublishedInput(value: PublishedInput): boolean {
  return value === true || value === "true";
}
