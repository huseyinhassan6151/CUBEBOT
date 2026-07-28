require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { connectDatabase } = require('./database/connect');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const config = require('./config/config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember]
});

client.commands = new Collection();
client.config = config;

(async () => {
  await connectDatabase();
  loadCommands(client);
  loadEvents(client);

  if (!config.token) {
    console.error('[CUBEBOT] DISCORD_TOKEN is missing from your .env file. Cannot start the bot.');
    process.exit(1);
  }

  await client.login(config.token);

  // Optionally start the dashboard alongside the bot (same process, useful on Railway)
  if (process.env.START_DASHBOARD_WITH_BOT === 'true') {
    require('./dashboard/server');
  }
})();

process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err);
});
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]', err);
});
