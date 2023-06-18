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

> Guess who's the message author! Made for friends discord servers.

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/62ce9585dd0c42e8af7b4c11e7fe456d)](https://www.codacy.com/gh/Pexilo/Stealthy/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Pexilo/Stealthy&utm_campaign=Badge_Grade)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Pexilo_Stealthy&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Pexilo_Stealthy)
[![wakatime](https://wakatime.com/badge/user/505d5239-8982-443a-af40-f424ba106165/project/c004fcfc-e297-420f-9c3d-24a9f9be469f.svg "Time spent coding the bot")](https://wakatime.com/badge/user/505d5239-8982-443a-af40-f424ba106165/project/c004fcfc-e297-420f-9c3d-24a9f9be469f)

## ❓ About Who's That

Who's That was born from my desire to infuse my primary Discord hangout server with fun and interactivity. In a server filled with quirky and occasionally borderlines convos, I had the idea of adding a guessing game element to spice things up. <br />So, over the course of a weekend, I brought this concept to life.<br />This particular bot is just one of the many Discord bots I've created. I believe that sharing it would please some people servers, so here you go!

## ✨ What's the bot doin

####  Picker channel pic
Typing `/whosthat` will send a message to let you choose which *Who's That* to send.
####  Whos that channel pic
This let your server users guess who is behind the message 🕵️
####  Leaderboard pic
Challenge your friends 😎


#### Make sure to `/setup` your server first 🥶

## 🌎 Supported Languages

#### • ☕ English᲼᲼᲼᲼᲼᲼᲼• 🥖 French᲼᲼᲼


> yes yes oui oui

Feel free to report any [bad translations, bugs, features requests](https://github.com/Pexilo/Whos-That/issues)

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
3. Connect it with *"connect your application"*
4. Copy your connection string
5. Replace `<password>` with your database access user password
6. Keep it for later use

#### Your bot:
1. Log in to your Discord account on the [Discord Developer Portal](https://discord.com/developers/applications) website ([Discord Developer Portal](https://discord.com/developers/applications)).
2. Click the "New Application" button to create a new application.
3.  Give your application a name and click *"Create."*
4.  In the left panel, click on *"Bot"* in the menu.
5.  Click the *"Add Bot"* button.
6.  Under the *"Token"* section, click *"Copy"* to copy the bot's token. Use *"Reset"* if you can't copy it right away.
7. Keep your **token** and **client ID** for later use
8.  Under the "Privileged Gateway Intents" section, enable *"Servers Members"* & *"Message Content"* intents.

### Start the bot

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

 <img alt="Commands-Ids" src="https://github.com/Pexilo/Whos-That/assets/67436391/c98c9da4-7186-40a8-9b52-e4753cb48f64">

##### 🚀 LAUNCH BOT

1. Install dependencies

```
npm i
```

2. Start the bot

```
node .
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
