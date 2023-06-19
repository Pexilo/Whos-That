import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  GuildMember,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import LanguageManager from "./language-manager";
import { FetchAndGetLang } from "./shortcuts";

export default async function SelectUsers(
  members: GuildMember[],
  interaction: CommandInteraction
) {
  const { guild } = interaction;
  const { guildData, lang } = await FetchAndGetLang(guild!);

  const languageManager = new LanguageManager();
  const generateSelectUsers =
    languageManager.getUtilsTranslation(lang).generateSelectUsers;

  //Users per page (max 25)
  const usersPerPage = 25;
  let currentPageIndex: number = 0;
  let startIndex: number = 0;
  let endIndex: number = 0;

  const totalPages = Math.ceil(members.length / usersPerPage);

  //Change the indexes
  let updatedIndexes = GetIndexes(
    currentPageIndex,
    totalPages,
    startIndex,
    endIndex,
    usersPerPage
  );
  currentPageIndex = updatedIndexes.currentPageIndex;
  startIndex = updatedIndexes.startIndex;
  endIndex = updatedIndexes.endIndex;

  const selectedMembers = members.slice(startIndex, endIndex);

  //Select Row
  const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>();
  const select = new StringSelectMenuBuilder()
    .setCustomId("users-select")
    .setPlaceholder(eval(generateSelectUsers.placeholder))
    .setMinValues(1)
    .setMaxValues(selectedMembers.length)
    .addOptions(
      selectedMembers.map((member) => {
        return new StringSelectMenuOptionBuilder()
          .setLabel(member.displayName)
          .setValue(member.id)
          .setDescription(member.user.username)
          .setDefault(guildData.pickableUsers.includes(member.id));
      })
    );
  selectRow.addComponents(select);

  //Buttons Row
  const buttonRow = new ActionRowBuilder<ButtonBuilder>();
  const previousButton = new ButtonBuilder()
    .setCustomId("previous-users")
    .setEmoji("◀️")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true);
  const nextButton = new ButtonBuilder()
    .setCustomId("next-users")
    .setEmoji("▶️")
    .setStyle(ButtonStyle.Secondary);
  if (totalPages === 1) nextButton.setDisabled(true);
  buttonRow.addComponents(previousButton, nextButton);

  await interaction.editReply({
    content: eval(generateSelectUsers.response),
    components: [selectRow, buttonRow],
  });

  //Create a collector for the buttons
  const collector = interaction.channel!.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
  });

  //Manage events
  collector.on("collect", async (button) => {
    switch (button.customId) {
      case "previous-users":
        currentPageIndex--;
        break;
      case "next-users":
        currentPageIndex++;
        break;
    }
    button.deferUpdate();

    //Change the indexes
    updatedIndexes = GetIndexes(
      currentPageIndex,
      totalPages,
      startIndex,
      endIndex,
      usersPerPage
    );
    currentPageIndex = updatedIndexes.currentPageIndex;
    startIndex = updatedIndexes.startIndex;
    endIndex = updatedIndexes.endIndex;

    const selectedMembers = members.slice(startIndex, endIndex);

    //Update select menu
    selectRow.components[0].setOptions([]);
    selectRow.components[0].setMaxValues(selectedMembers.length);
    selectRow.components[0].setPlaceholder(
      eval(generateSelectUsers.placeholder)
    );
    selectRow.components[0].addOptions(
      selectedMembers.map((member) => {
        return new StringSelectMenuOptionBuilder()
          .setLabel(member.displayName)
          .setValue(member.id)
          .setDescription(member.user.username)
          .setDefault(guildData.pickableUsers.includes(member.id));
      })
    );

    //Update buttons visibility
    previousButton.setDisabled(currentPageIndex === 0);
    nextButton.setDisabled(currentPageIndex === totalPages - 1);
    buttonRow.components[0] = previousButton;
    buttonRow.components[1] = nextButton;

    await interaction.editReply({
      content: eval(generateSelectUsers.response),
      components: [selectRow, buttonRow],
    });
  });
}

function GetIndexes(
  currentPageIndex: number,
  totalPages: number,
  startIndex: number,
  endIndex: number,
  usersPerPage: number
) {
  let newStartIndex = startIndex;
  let newEndIndex = endIndex;

  if (currentPageIndex < 0) {
    currentPageIndex = 0;
  } else if (currentPageIndex >= totalPages) {
    currentPageIndex = totalPages - 1;
  }

  newStartIndex = currentPageIndex * usersPerPage;
  newEndIndex = newStartIndex + usersPerPage;

  return { currentPageIndex, startIndex: newStartIndex, endIndex: newEndIndex };
}
