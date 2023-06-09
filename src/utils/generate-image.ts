import { GlobalFonts } from "@napi-rs/canvas";
import { AttachmentBuilder, Message } from "discord.js";
import { join } from "path";
import { Truncate } from "./shortcuts";

const { createCanvas, loadImage } = require("@napi-rs/canvas");

async function GenerateDiscordMessage(message: Message) {
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const fileName = `${dateStr}_${message.id}.png`;

  GlobalFonts.registerFromPath("src/assets/whosthatfix.ttf", "WhosThat");
  const canvas = createCanvas(800, 300);
  const ctx = canvas.getContext("2d");

  //Load background
  const background = await loadImage(
    "src/assets/discord_message_bg-darker.png"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  //Text
  ctx.strokeStyle = "#2b2d31";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.font = "30px WhosThat";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Utilisateur", 200, 105);
  ctx.fillStyle = "#e4e6e8";
  ctx.fillText(
    LineBreak(ctx, Truncate(message.content, 150), 200, 150, 550, 40),
    0,
    0
  );

  //User avatar
  const avatar = await loadImage("src/assets/user_avatar.png");
  ctx.beginPath();
  ctx.arc(110, 120, 50, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 60, 70, 100, 100);

  //Attachment
  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "profile-image.png",
  });

  //Save image
  const buffer = canvas.toBuffer("image/png");
  require("fs").writeFileSync(join("src/history/", fileName), buffer);

  return {
    attachment,
    content: message.content,
  };
}

function LineBreak(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  var words = text.split(" ");
  var line = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = ctx.measureText(testLine);
    var testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

export default GenerateDiscordMessage;
