import { CommandInteraction, Message } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

const languages = ["portuguese", "english", "french", "spanish", "indian"];

// const idioma: SlashChoiceType[] = [
//   {name: "português", value: "Portugês"},
//   {name: "inglês", value:"Inglês"}
// ]

const idioma = ["portuguese", "english"];

@Discord()
export class Config {
    @Slash("config", {
        description:
            "Configure o seu Voice Transcription, selecione idioma e legenda",
    })
    config(
        @SlashChoice(...idioma)
        @SlashOption("idioma", { description: "Lingua falada" })
        idioma: string,

        @SlashChoice(...languages)
        @SlashOption("legenda", { description: "Legenda gerada" })
        legenda: string,
        interaction: CommandInteraction
    ): void {
        const idiomaFormatado = idioma[0].toUpperCase() + idioma.substring(1);
        const legendaFormatada =
            legenda[0].toUpperCase() + legenda.substring(1);

        interaction.reply(
            `Idioma: ${idiomaFormatado} Legenda: ${legendaFormatada}`
        );
    }
}
