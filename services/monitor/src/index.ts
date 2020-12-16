import { SupremeMonitor } from './monitors/SupremeMonitor';
import { DatabaseProvider } from './provider/DatabaseProvider';
import { MonitorModel } from './model/Monitor';
import { DiscordService } from './services/DiscordService';
import { RedisService } from './services/RedisService';

const dbProvider = new DatabaseProvider();
const monitorModel = new MonitorModel(dbProvider);
const discordService = new DiscordService();
const redisService = new RedisService();

const supremeMonitor = new SupremeMonitor(monitorModel, discordService, redisService);
supremeMonitor.Setup();

setInterval(() => {
  supremeMonitor.Run();
}, 30 * 1000)