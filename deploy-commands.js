require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { getAllCommandData } = require('./handlers/commandHandler');
const { token, clientId, guildId } = require('./config/config');

const commands = getAllCommandData();
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`[Deploy] Registering ${commands.length} slash commands...`);

    if (process.argv.includes('--global')) {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('[Deploy] Successfully registered GLOBAL commands (may take up to 1 hour to appear).');
    } else {
      if (!guildId) {
        console.error('[Deploy] GUILD_ID is missing from .env. Use --global to deploy globally instead, or set GUILD_ID for instant guild deploys.');
        process.exit(1);
      }
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log(`[Deploy] Successfully registered commands to guild ${guildId} (instant).`);
    }
  } catch (err) {
    console.error('[Deploy] Failed to register commands:', err);
  }
})();
