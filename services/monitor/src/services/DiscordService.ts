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
        botImage = 'http://lazyshoebot.com/logoWide.png';

      let strings = webHook.split('/');
      let id = strings[strings.length-2];
      let token = strings[strings.length-1];
      this.webhookClient = new WebhookClient(id, token);
      let colors = ['#0099ff', '#aaee99', '#aaee77', '#d0d000'];
      let index = Math.floor(Math.random() * colors.length);
      let message: MessageEmbed = new MessageEmbed()
        .setColor(colors[index])
        .setTitle(shoeName)
        .setURL(href)
        .setDescription(`**Preis:** ${price}€\n**Erhältlich:** \u2705`)
        .setTimestamp()
        .setFooter('Powered by LazyShoeBot', 'http://lazyshoebot.com/logoWide.png');
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