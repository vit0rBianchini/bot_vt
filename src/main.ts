import "reflect-metadata";
import { importx, dirname } from "@discordx/importer";
import { Client } from "discordx";
import dotenv from "dotenv";
import { Intents } from "discord.js";
import type { Interaction, Message } from "discord.js";

dotenv.config();

const aplicacao = new Client({
    botId: "VT",
    botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    silent: false,

    simpleCommand: {
        prefix: "!",
    },
});

aplicacao.once("ready", async () => {
    await aplicacao.clearApplicationCommands();
    await aplicacao.guilds.fetch();
    await aplicacao.initApplicationCommands();
    await aplicacao.initApplicationPermissions();

    console.log("BOT COMEÇOU");
});

aplicacao.on("interactionCreate", (interacao: Interaction) => {
    aplicacao.executeInteraction(interacao);
});

aplicacao.on("messageCreate", (message: Message) => {
    aplicacao.executeCommand(message);
});

async function run() {
    await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");
    if (!process.env.BOT_TOKEN) {
        throw Error("Could not find BOT_TOKEN in your environment");
    }
    await aplicacao.login(process.env.BOT_TOKEN);
}

run();
