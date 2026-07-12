import { DomainValidationError } from "./domain-validation.error";

declare const moneyInPenceBrand: unique symbol;

export type MoneyInPence = number & {
  readonly [moneyInPenceBrand]: "MoneyInPence";
};

export const createMoneyInPence = (input: number): MoneyInPence => {
  if (!Number.isFinite(input) || !Number.isInteger(input) || input < 0) {
    throw new DomainValidationError("Money in pence must be a non-negative integer");
  }

  return input as MoneyInPence;
};

export const addMoneyInPence = (values: readonly MoneyInPence[]): MoneyInPence => {
  const total = values.reduce((sum, value) => sum + value, 0);

  return createMoneyInPence(total);
};
