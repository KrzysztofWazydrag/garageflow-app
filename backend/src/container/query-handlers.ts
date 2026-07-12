import { AwilixContainer } from "awilix";
import { asArray } from "@tshio/awilix-resolver";

// HANDLERS_IMPORTS

export async function registerQueryHandlers(container: AwilixContainer) {
  container.register({
    queryHandlers: asArray<any>([
      // QUERY_HANDLERS_SETUP
    ]),
  });

  return container;
}
