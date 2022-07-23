import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import {
    Client,
    CommandInteraction,
    MessageActionRow,
    MessageSelectMenu,
    SelectMenuInteraction,
} from "discord.js";

import { Discord, Slash, SelectMenuComponent } from "discordx";

interface IOptions {
    label: string;
    value: string;
}

const roles: IOptions[] = [];
let connection: VoiceConnection;
let roleValue: string;

@Discord()
export class Start {
    @SelectMenuComponent("start")
    async handle(interaction: SelectMenuInteraction, client: Client) {
        await interaction.deferReply();

        // extract selected value by member
        roleValue = interaction.values?.[0];

        // if value not found
        if (!roleValue)
            return await interaction.followUp("invalid channel, select again");
        else {
            await interaction.followUp(
                `You have selected channel: ${
                    roles.find((r) => r.value === roleValue)?.label
                }`
            );
        }

        const channels = client.channels.cache;

        channels.forEach((ele: any) => {
            if (ele.id === roleValue) {
                connection = joinVoiceChannel({
                    channelId: ele.id,
                    guildId: ele.guild.id,
                    adapterCreator: ele.guild.voiceAdapterCreator,
                });
            }
        });

        return;
    }

    @Slash("start", {
        description: "Selecione o canal de voz e comece a legendar sua fala",
    })
    async myRoles(
        interaction: CommandInteraction,
        client: Client
    ): Promise<unknown> {
        await interaction.deferReply();

        client.channels.cache.forEach((canais) => {
            if (canais.type === "GUILD_VOICE") {
                const objeto: IOptions = {
                    label: canais.name,
                    value: canais.id,
                };

                roles.push(objeto);
            }
        });

        // create menu for roles
        const menu = new MessageSelectMenu()
            .addOptions(roles)
            .setCustomId("start");

        // create a row for message actions
        const buttonRow = new MessageActionRow().addComponents(menu);

        // send it
        interaction.editReply({
            content: "Select your channel",
            components: [buttonRow],
        });

        return;
    }

    @Slash("end", {
        description:
            "O Voice Transcription será desconcetado do canal de voz que ele esteja",
    })
    end(interaction: CommandInteraction) {
        if (roleValue) {
            interaction.reply(
                `O bot foi removido do canal: ${
                    roles.find((r) => r.value === roleValue)?.label
                }`
            );
        } else {
            interaction.reply(`O bot não está conectado em nenhum canal`);
        }
        connection.destroy();
    }
}
