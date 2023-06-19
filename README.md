
<div align="center">
<img src="https://github.com/Pexilo/Whos-That/assets/67436391/fa031cc9-d9f5-4538-8a49-64df39791eca" align="center">
  <a href="https://github.com/Pexilo/Whos-That/releases" target="_blank">
    <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-yellow.svg?cacheSeconds=2592000&style=for-the-badge" />
  </a>
  <a href="https://github.com/Pexilo/Whos-That/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
  </a>
</div>

##

> Guess who's the message author! Bring life to small discord servers.

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pexilo_Whos-That&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Pexilo_Whos-That)
[![wakatime](https://wakatime.com/badge/user/505d5239-8982-443a-af40-f424ba106165/project/c004fcfc-e297-420f-9c3d-24a9f9be469f.svg "Time spent coding the bot")](https://wakatime.com/badge/user/505d5239-8982-443a-af40-f424ba106165/project/c004fcfc-e297-420f-9c3d-24a9f9be469f)

## ❓ About Who's That

Who's That was born from my desire to infuse my primary Discord hangout server with fun and interactivity. In a server filled with quirky and occasionally borderlines convos, I had the idea of adding a guessing game element to spice things up. <br />So, over the course of a weekend, I brought this concept to life.<br />This particular bot is just one of the many Discord bots I've created. I believe that sharing it would please some people servers, so here you go!

## ✨ What's the bot doin

> Thank you GPT-3 for the cringy demo messages 🫠

### 1️⃣ Picker Channel

Pick carefully the best message 😎

<img src="https://github.com/Pexilo/Whos-That/assets/67436391/006f7dbf-1b68-403b-9f82-c8c8c83f5991"  width="450" height="500">

When typing `/whosthat` you will be prompt with `1` to `10` random messages.
You can pick your desired message with the corresponding button, or reload messages with the 🔁 button.
The picked message will be sent to the _Who's That_ channel.

### 2️⃣ Who's That message preview

Let your friends guess who's behind the (cringy) message 🕵️

<img src="https://github.com/Pexilo/Whos-That/assets/67436391/57c3d115-c3ae-4c88-ad33-9d7084b9b547"  width="500" height="390">

The picked message will then appear in the **Who's That** channel. _#BossBattleConquered_ 👍😃

### 3️⃣ Leaderboard

Challenge your friends 🏆

<img src="https://github.com/Pexilo/Whos-That/assets/67436391/91b9660b-6b08-4375-a4e1-c5b27191982e"  width="300" height="180">

Leaderboard will show **total points**, **correct answers**, **position**.
_Point rules:_
`+1` point for participating
`+1` point for correctly guessing
_This is subject to change._

## Make sure to `/setup` your server first 🥶

#### In depth `/setup` explanation & tips.

<img src="https://github.com/Pexilo/Whos-That/assets/67436391/a6a5e8d6-3e1e-436f-9770-084bc2b9e9e2"  width="500" height="100">

**Target:** channel where to **fetch** messages from. 
**Picker:** channel where to **pick** message from. 
**Who's That:** channel where to **send** message to. 

> Make sure to lock the **Who's That** channel to make it view only to keep it clean, 
> and make the **Picker** channel private.

After setting up the channels, you will be prompt to pick users 👥

<img src="https://github.com/Pexilo/Whos-That/assets/67436391/5db6f41e-499c-4f95-a235-d42de7aa9fc3"  width="400" height="140">

Picking users will filter the messages to only show the selected users messages. <br />
Select as many users as you want.

> You can change the users list with `/users` command at any time.

You're all set! 🎉<br />
You can begin with `/whosthat` command.

## More in depth explanation 🤓 

### 📥 Fetching messages

Target channel will fetch message Ids called "checkpoints" (each 100 messages) to avoid fetching all messages at once. 
For example, if you have 1000 messages in your target channel, the bot will fetch 10 checkpoints (100 messages each) and add them to a list. 
From my experience, fetching 100 000 messages takes roughly 15–20 minutes. 

When you request Who's That messages to pick, the bot will randomly pick 2 checkpoints from the list, and fetch 100 messages from the checkpoint. 
Then, the bot will randomly pick 5 messages from each checkpoint, and send them to the picker channel. Take note that the bot will filter messages along the process. <br />

#### 📝 Message filtering

The bot will filter messages that are too short, that contains a link, attachment, embed, contains only an emoji or a discord mention. And obviously, only messages that are from picked users. <br />

### 🎮 The game & leaderboard

When you pick a message, the bot will send it to the Who's That channel. 
This sent message will contain a select with 5 choices (4 random users and the author).

When you pick a user, the bot will check if the user is the correct one. 
Check above rules for points attribution. 

The leaderboard is accessible on each Who's That message with a button or with `/leaderboard` command.
The leaderboard will show 10 players per page (depends on same positions). 

> Because of the fetching system of the bot that request a lot of API calls, I will not provide a public version of the bot. Watch out for large channel fetchs that can cause your application to be banned (I didn't tried fetching more than 200k messages).

## 🌎 Supported Languages

#### • ☕ English᲼᲼᲼᲼᲼᲼᲼• 🥖 French

> yes yes oui oui

Feel free to report any [bad translations, bugs, features requests...](https://github.com/Pexilo/Whos-That/issues)

##

### 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Pexilo/Whos-That/issues).

### 📝 License

[MIT License](https://github.com/Pexilo/Whos-That/blob/main/LICENSE)
Copyright (c) 2023 Pexilo

### 👏 Show your support

Simply give me a ⭐️ to support me! 😄

## ⚙️ Installation

### Requirements

- 📃 Node.js 16.9 or higher
- 🍃 MongoDB cluster
- 🤖 Discord Bot

#### MongoDB:

1. Create an [account](https://account.mongodb.com/account/login)
2. Create a cluster
3. Connect it with _"connect your application"_
4. Copy your connection string
5. Replace `<password>` with your database access user password
6. Keep it for later use

#### Your bot:

1. Log in to your Discord account on the [Discord Developer Portal](https://discord.com/developers/applications) website ([Discord Developer Portal](https://discord.com/developers/applications)).
2. Click the "New Application" button to create a new application.
3. Give your application a name and click _"Create."_
4. In the left panel, click on _"Bot"_ in the menu.
5. Click the _"Add Bot"_ button.
6. Under the _"Token"_ section, click _"Copy"_ to copy the bot's token. Use _"Reset"_ if you can't copy it right away.
7. Keep your **token** and **client ID** for later use
8. Under the "Privileged Gateway Intents" section, enable _"Servers Members"_ & _"Message Content"_ intents.

### 💫 Quick start

- Clone the repo

```
git clone https://github.com/Pexilo/Whos-That
```

##### 🤖 BOT INVITE

1. Finish the above steps
2. Replace `<clientId>` with your bot ID / client ID

`https://discord.com/api/oauth2/authorize?client_id=<clientId>&permissions=117760&scope=applications.commands%20bot`

2. Invite your bot with the above link to your server

##### 🧾 ENV FILE

1. Replace content of `example.env`

```
DISCORD_TOKEN=your-bot-token
MONGO_URI=your-mongo-db-connection-string
```

2. Rename the file `example.env` > `.env`

##### 📜 CONFIG

`src/congig.ts`

```
import * as dotenv from "dotenv";
dotenv.config();

export default {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  MONGO_URI: process.env.MONGO_URI,
  SLASH_COMMANDS_IDS: {
    users: "1118657612783812622", //Edit this Id with your command Id
    setup: "1118657612783812621", //Also here
    whosthat: "1119193500429336669", //And here
  },
};
```

#### But how ? 🥴

On the bot Discord server:<br />
`server settings > integrations > select Who's That bot`

 <img alt="Commands-Ids" src="https://github.com/Pexilo/Whos-That/assets/67436391/8b1c8e5b-be61-4cc6-93d0-86ecbb84ebf4" width="320" height="300">

#### 🚀 LAUNCH BOT

1. Install dependencies

```
npm i
```

2. Start the bot

```
npm run start
```

## 🦾 Powered by

<div align="center" style="display:flex;">
    <a href="https://discord.js.org/" target="_blank">
        <img alt="DiscordJs" src="https://user-images.githubusercontent.com/67436391/179405418-a3dd9886-725b-4ed3-9ca6-d1eb73e4a67d.png" />
    </a>
    <a href="https://sheweny.js.org/" target="_blank">
        <img alt="Sheweny" src="https://user-images.githubusercontent.com/67436391/179405417-eb4c8938-5abd-4a7c-a978-cac58a06707f.png" />
    </a>
    <a href="https://www.mongodb.com/" target="_blank">
        <img alt="MongoDB" src="https://user-images.githubusercontent.com/67436391/179426484-d3fb357a-4702-4785-b0e1-7dc443923dab.jpeg" />
    </a>
        <a href="https://github.com/Vibrant-Colors/node-vibrant" target="_blank">
        <img alt="Node-Vibrant" src="https://avatars.githubusercontent.com/u/62979566?s=100" />
    </a>
</div>

And much more like [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas), [Discord Avatar Maker](https://discord-avatar-maker.app/) for message previews.
