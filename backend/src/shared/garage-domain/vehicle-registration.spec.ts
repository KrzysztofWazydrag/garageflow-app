import { expect } from "chai";
import { DomainValidationError } from "./domain-validation.error";
import { normalizeVehicleRegistration } from "./vehicle-registration";

describe("normalizeVehicleRegistration", () => {
  it("trims and uppercases vehicle registration", () => {
    const result = normalizeVehicleRegistration(" ab12 cde ");

    expect(result).to.equal("AB12CDE");
  });

  it("removes internal spaces", () => {
    const result = normalizeVehicleRegistration("AB 12 C DE");

    expect(result).to.equal("AB12CDE");
  });

  it("rejects empty input", () => {
    expect(() => normalizeVehicleRegistration("")).to.throw(DomainValidationError, "Vehicle registration is required");
  });

  it("rejects whitespace-only input", () => {
    expect(() => normalizeVehicleRegistration("   ")).to.throw(
      DomainValidationError,
      "Vehicle registration is required",
    );
  });
});
