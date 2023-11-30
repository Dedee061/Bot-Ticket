const {Client, 
    GatewayIntentBits,
    Partials, 
    EmbedBuilder, 
    PermissionFlagsBits, 
    ApplicationCommandOptionType,
    ActivityType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Status,
    SelectMenuBuilder,
    StringSelectMenuBuilder,
    WebhookClient,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Collection,
    channelLink
 } = require('discord.js');


 const client = new Client({ 
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ],
    
    Partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User
    ]
});

// config
const {token, ColorEmbed, textoEmbed, imagemEmbed, Footer, textoEmbedTicket, Title} = require('./config.json')

client.on("ready", () => {

        let commands 
        commands = client.application.commands

        commands.create({
            name: "ticket",
            description: "Enviar o ticket no canal"
        })

        // interaction.reply({embeds: [new EmbedBuilder() .setColor(ColorEmbed) .setDescription(`o Membro <@${interaction.user.id}> esta tendo usar o comando **/${interaction.commandName}**`)]})
        // interaction.user.send({embeds: [new EmbedBuilder() .setColor(ColorEmbed) .setDescription(`Você não te permissão para usar o comando **/${interaction.commandName}**`)]})

    console.log("Estou online mano")
})



client.on('interactionCreate', (interaction) => {

    

    if (interaction.commandName == "ticket") {

        // VERIFICANDO PERMISSÃO
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return  interaction.reply({embeds: [new EmbedBuilder() .setColor(ColorEmbed) .setDescription(`o Membro <@${interaction.user.id}> esta tendo usar o comando **/${interaction.commandName}**`)]}),  interaction.user.send({embeds: [new EmbedBuilder() .setColor(ColorEmbed) .setDescription(`Você não te permissão para usar o comando **/${interaction.commandName}**`)]}) 

        // CRIANDO UMA EMBED PARA ENVIAR
        const embed = new EmbedBuilder()
        .setTitle(Title)
        .setDescription(textoEmbed)
        .setColor(ColorEmbed)
        .setImage(imagemEmbed)
        .setThumbnail(interaction.guild.iconURL({dynamic: true}))
        .setFooter({text: `${Footer}`})


        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('buttonTicket')
                .setLabel('✅ Abrir Ticket')
                .setStyle(ButtonStyle.Secondary)
        )

        interaction.reply({embeds: [embed], components: [row]})
        
        
    }
    
    // INTERAÇÃO COM O BOTÃO
    if(interaction.isButton()){
            if(interaction.customId === 'buttonTicket'){
                const VChannel = interaction.guild.channels.cache.find( e => e.name == `ticket-${interaction.user.username}`)
                if(VChannel) return interaction.reply({embeds: [new EmbedBuilder().setDescription(`ja existe um ticket aberto em <#${VChannel.id}>`).setColor(ColorEmbed)], ephemeral:true})


                const channel = interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    topic: `Ticket-${interaction.user.id}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: ["ViewChannel"], 
                               
                        },
                    
                        {
                            id: interaction.user.id,
                            allow: ["ViewChannel","SendMessages"]
                        }
                    ]
                }).then((channel) => {
                    interaction.reply({ embeds: [new EmbedBuilder() .setDescription(`Ticket criado em <#${channel.id}>`)], ephemeral: true})

                    const embedTicket = new EmbedBuilder()
                    
                    .setDescription(textoEmbedTicket)
                    .setThumbnail(interaction.guild.iconURL({dynamic: true}))
                    .setColor(ColorEmbed)

                    const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('buttonClose')
                            .setLabel('❌ Fechar Ticket')
                            .setStyle(ButtonStyle.Danger),

                        new ButtonBuilder()
                            .setCustomId('buttonNotify')
                            .setLabel('📣 Notificar Membro')
                            .setStyle(ButtonStyle.Success)
                    )
            

                    channel.send({ content:`|| <@${interaction.user.id}> / @here||`, embeds:[embedTicket], components:[row]})
                }) 
            }
        
    }

    if(interaction.isButton()) {
        if (interaction.customId == "buttonNotify") {
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Você não tem permissão para usar este comando!`, ephemeral: true })
            var idUser = interaction.channel.topic
            idUser = idUser.replace(/\D/g, '')
            
            const veUserServer =  interaction.guild.members.cache.find(cl => cl.id == idUser)
            if (!veUserServer) return  interaction.reply({ content: `Membro não se encontra mais no Servidor!`, ephemeral: true })
             veUserServer.send({ embeds: [new EmbedBuilder().setTitle("📣 NOTIFICAÇÂO") .setDescription(`\n\n> 🎈 | ***Olá ${veUserServer.user.tag}, o staff ${interaction.user.username} está a sua esperá no Ticket que você abriu.***`).setColor(ColorEmbed)] })
             interaction.reply({ embeds: [new EmbedBuilder().setDescription('✅ Membro Notificado Com sucesso!!').setColor(ColorEmbed)], ephemeral: true })
            
        }
    }
})


client.login(token)