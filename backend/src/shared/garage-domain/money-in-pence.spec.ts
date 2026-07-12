import { expect } from "chai";
import { DomainValidationError } from "./domain-validation.error";
import { addMoneyInPence, createMoneyInPence } from "./money-in-pence";

describe("createMoneyInPence", () => {
  it("accepts zero", () => {
    const result = createMoneyInPence(0);

    expect(result).to.equal(0);
  });

  it("accepts positive integer", () => {
    const result = createMoneyInPence(1299);

    expect(result).to.equal(1299);
  });

  it("rejects negative numbers", () => {
    expect(() => createMoneyInPence(-1)).to.throw(
      DomainValidationError,
      "Money in pence must be a non-negative integer",
    );
  });

  it("rejects decimal numbers", () => {
    expect(() => createMoneyInPence(10.5)).to.throw(
      DomainValidationError,
      "Money in pence must be a non-negative integer",
    );
  });

  it("rejects NaN", () => {
    expect(() => createMoneyInPence(Number.NaN)).to.throw(
      DomainValidationError,
      "Money in pence must be a non-negative integer",
    );
  });

  it("rejects Infinity", () => {
    expect(() => createMoneyInPence(Number.POSITIVE_INFINITY)).to.throw(
      DomainValidationError,
      "Money in pence must be a non-negative integer",
    );
  });
});

describe("addMoneyInPence", () => {
  it("adds multiple MoneyInPence values", () => {
    const result = addMoneyInPence([createMoneyInPence(100), createMoneyInPence(250), createMoneyInPence(50)]);

    expect(result).to.equal(400);
  });
});
