import { Service } from 'typedi';
import { IResult } from '../types/IResult';

import { MessageEmbed, WebhookClient } from 'discord.js';

@Service()
export class DiscordService {
  private webhookClient: WebhookClient;

  async SendTestMessage({webHook, botName, botImage}: {webHook: string, botName: string, botImage: string}): Promise<IResult> {
    try {
      if (!botName)
        botName = 'LSB Monitor';

      if (!botImage)
        botImage = 'https://images.discordapp.net/avatars/525382819808280597/f3e9d922bafff516be910eba12a560e5.png?size=512';

      let strings = webHook.split('/');
      let id = strings[strings.length-2];
      let token = strings[strings.length-1];
      this.webhookClient = new WebhookClient(id, token);
      this.webhookClient.send('Hello there!', {
        username: botName,
        avatarURL: botImage
      });
      return {success: true, data: {message: 'Send Message successfully'}};   
    } catch (error) {
      return {success: false, error};
    }
  }
}