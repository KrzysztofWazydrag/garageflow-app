import { AwilixContainer } from "awilix";
import { asArray } from "@tshio/awilix-resolver";

// SUBSCRIBERS_IMPORTS

export async function registerSubscribers(container: AwilixContainer) {
  container.register({
    eventSubscribers: asArray<any>([
      // SUBSCRIBERS_SETUP
    ]),
  });

  return container;
}
