import { MessageEmbed, WebhookClient } from 'discord.js';
import { Monitor } from '../types/Monitor';

export class DiscordService {
  private webhookClient: WebhookClient;

  async SendMessage({monitor, shoeName, price, href}: {monitor: Monitor, shoeName: string, price: number, href: string}) {
    try {
      let botName = monitor.botName;
      let botImage = monitor.botImage;
      let webHook = monitor.webHook;

      if (!botName)
        botName = 'LSB Monitor';

      if (!botImage)
        botImage = 'https://images.discordapp.net/avatars/525382819808280597/f3e9d922bafff516be910eba12a560e5.png?size=512';

      let strings = webHook.split('/');
      let id = strings[strings.length-2];
      let token = strings[strings.length-1];
      this.webhookClient = new WebhookClient(id, token);
      let message: MessageEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(shoeName)
        .setURL(href)
        .setDescription(`Ist wieder für ${price}€ erhältlich.`);
      this.webhookClient.send({
        embeds: [message],
        username: botName,
        avatarURL: botImage
      });
      this.webhookClient = undefined;
    } catch (error) {
    }
  }
}