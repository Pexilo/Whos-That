import { UpdateGuild } from "@utils/shortcuts";
import { CommandInteraction, Guild, TextChannel } from "discord.js";
import LanguageManager from "./language-manager";

export async function fetchChannelCheckpoints(
  source: TextChannel,
  guild: Guild,
  interaction: CommandInteraction,
  lang: string
) {
  let lastMessageId: string | undefined;
  const messagesIndexes = [];
  const languageManager = new LanguageManager();
  const fetchMessages = languageManager.getUtilsTranslation(lang).fetchMessages;

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

    const messagesLength = messagesIndexes.length * 100;
    interaction.editReply({
      content: eval(fetchMessages.pocessing),
    });
  }

  return messagesIndexes.length;
}
