import { FetchGuild, IncrementGuildData, UpdateGuild } from "@utils/shortcuts";
import { CommandInteraction, Guild, TextChannel } from "discord.js";
import LanguageManager from "./language-manager";

export async function fetchChannelCheckpoints(
  source: TextChannel,
  guild: Guild,
  interaction: CommandInteraction,
  lang: string
) {
  const guildData = await FetchGuild(guild);
  const amountPreviousMessages = guildData.checkpoints?.length || 0;
  let lastMessageId: string | undefined = guildData.checkpoints?.slice(-1)[0];
  const messagesIndexes = [];

  const startTime = Date.now();
  const interval = 5 * 1000;

  while (true) {
    const options = lastMessageId
      ? { limit: 100, before: lastMessageId }
      : { limit: 100 };
    const fetchedMessages = await source.messages.fetch(options);

    if (!fetchedMessages?.size) {
      return messagesIndexes.length + amountPreviousMessages;
    }
    if (Date.now() - startTime >= interval) {
      if (fetchedMessages?.size) {
        await IncrementGuildData(guild, { checkpoints: messagesIndexes });
        break;
      }
    }

    lastMessageId = fetchedMessages.lastKey();
    messagesIndexes.push(fetchedMessages.lastKey());
  }
  return undefined;
}
