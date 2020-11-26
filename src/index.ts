import { isMaster, fork , on} from 'cluster';
import { cpus } from 'os';
import { startServer } from './app';

if (isMaster) {
  const cpuCount = cpus().length;
  for (let j = 0; j < cpuCount; j++) {
    fork();
  }
} else {
  startServer();
}

on('exit', function (worker) {
  console.log(`Worker ${worker.id} died'`);
  console.log(`Staring a new one...`);
  fork();
});