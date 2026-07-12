import { DomainValidationError } from "./domain-validation.error";

declare const vehicleRegistrationBrand: unique symbol;

export type VehicleRegistration = string & {
  readonly [vehicleRegistrationBrand]: "VehicleRegistration";
};

export const normalizeVehicleRegistration = (input: string): VehicleRegistration => {
  const normalizedRegistration = input.trim().replace(/\s+/g, "").toUpperCase();

  if (normalizedRegistration.length === 0) {
    throw new DomainValidationError("Vehicle registration is required");
  }

  return normalizedRegistration as VehicleRegistration;
};
