import { DomainValidationError } from "./domain-validation.error";

export const CALLBACK_STATUSES = ["NotRequired", "Required", "Done"] as const;

export type CallbackStatus = (typeof CALLBACK_STATUSES)[number];

export type NotRequiredCallbackFollowUp = Readonly<{
  callbackStatus: "NotRequired";
  callbackDueAt: null;
  lastContactedAt: null;
}>;

export type RequiredCallbackFollowUp = Readonly<{
  callbackStatus: "Required";
  callbackDueAt: Date;
  lastContactedAt: Date | null;
}>;

export type DoneCallbackFollowUp = Readonly<{
  callbackStatus: "Done";
  callbackDueAt: Date | null;
  lastContactedAt: Date;
}>;

export type CallbackFollowUp = NotRequiredCallbackFollowUp | RequiredCallbackFollowUp | DoneCallbackFollowUp;

export type CreateCallbackFollowUpInput =
  | Readonly<{
      callbackStatus: "NotRequired";
      callbackDueAt?: Date | null;
      lastContactedAt?: Date | null;
    }>
  | Readonly<{
      callbackStatus: "Required";
      callbackDueAt: Date | null;
      lastContactedAt?: Date | null;
    }>
  | Readonly<{
      callbackStatus: "Done";
      callbackDueAt?: Date | null;
      lastContactedAt: Date | null;
    }>;

const isValidDate = (date: Date): boolean => !Number.isNaN(date.getTime());

const assertValidDate = (date: Date, message: string): void => {
  if (!isValidDate(date)) {
    throw new DomainValidationError(message);
  }
};

const cloneDate = (date: Date): Date => new Date(date.getTime());

const cloneNullableDate = (date: Date | null | undefined): Date | null => {
  if (!date) {
    return null;
  }

  return cloneDate(date);
};

export const createCallbackFollowUp = (input: CreateCallbackFollowUpInput): CallbackFollowUp => {
  if (input.callbackStatus === "NotRequired") {
    if (input.callbackDueAt) {
      throw new DomainValidationError("Callback due date must be empty when callback is not required");
    }

    if (input.lastContactedAt) {
      throw new DomainValidationError("Last contacted date must be empty when callback is not required");
    }

    return Object.freeze({
      callbackStatus: "NotRequired",
      callbackDueAt: null,
      lastContactedAt: null,
    });
  }

  if (input.callbackStatus === "Required") {
    if (!input.callbackDueAt) {
      throw new DomainValidationError("Callback due date is required when callback is required");
    }

    assertValidDate(input.callbackDueAt, "Callback due date must be a valid date");

    if (input.lastContactedAt) {
      assertValidDate(input.lastContactedAt, "Last contacted date must be a valid date");
    }

    return Object.freeze({
      callbackStatus: "Required",
      callbackDueAt: cloneDate(input.callbackDueAt),
      lastContactedAt: cloneNullableDate(input.lastContactedAt),
    });
  }

  if (!input.lastContactedAt) {
    throw new DomainValidationError("Last contacted date is required when callback is done");
  }

  assertValidDate(input.lastContactedAt, "Last contacted date must be a valid date");

  if (input.callbackDueAt) {
    assertValidDate(input.callbackDueAt, "Callback due date must be a valid date");
  }

  return Object.freeze({
    callbackStatus: "Done",
    callbackDueAt: cloneNullableDate(input.callbackDueAt),
    lastContactedAt: cloneDate(input.lastContactedAt),
  });
};

export const isCallbackOverdue = (callback: CallbackFollowUp, referenceTime: Date): boolean => {
  assertValidDate(referenceTime, "Callback overdue reference time must be a valid date");

  return callback.callbackStatus === "Required" && callback.callbackDueAt.getTime() < referenceTime.getTime();
};
