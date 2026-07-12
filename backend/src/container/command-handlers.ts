import { AwilixContainer } from "awilix";
import { asArray } from "@tshio/awilix-resolver";

// HANDLERS_IMPORTS

export async function registerCommandHandlers(container: AwilixContainer) {
  container.register({
    commandHandlers: asArray<any>([
      // COMMAND_HANDLERS_SETUP
    ]),
  });

  return container;
}
