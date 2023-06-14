import { UpdateGuild } from "@utils/shortcuts";
import { CommandInteraction, Guild, TextChannel } from "discord.js";

export async function fetchChannelCheckpoints(
  source: TextChannel,
  guild: Guild,
  interaction: CommandInteraction
) {
  let lastMessageId: string | undefined;
  const messagesIndexes = [];

  while (true) {
    const options = lastMessageId
      ? { limit: 100, before: lastMessageId }
      : { limit: 100 };
    const fetchedMessages = await source.messages.fetch(options);

    if (!fetchedMessages?.size) {
      await UpdateGuild(guild, { checkpoints: messagesIndexes });
      break;
    }

    lastMessageId = fetchedMessages.lastKey();
    messagesIndexes.push(fetchedMessages.lastKey());

    interaction.editReply({
      content: `🔄 Processing \`${messagesIndexes.length * 100}\` messages...`,
    });
  }

  return messagesIndexes.length;
}
