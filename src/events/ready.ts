import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";

export class ReadyEvent extends Event {
  constructor(client: ShewenyClient) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  execute() {
    console.log(`✅ ${this.client.user!.username} bot`);
  }
}
