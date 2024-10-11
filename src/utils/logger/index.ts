import { promises as fs } from 'fs';
import { LogFunction } from './index.types';
import { LOG_DIR } from '../../../config/constants';
import { EnumLogLevel } from '../../../config/enums';

/**
 * Ensures the log directory exists, creating it if necessary.
 *
 * @throws {Error} if `fs.mkdir` throws an error other than 'EEXIST'
 */
const ensureLogDirectory = async () => {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') throw error;
  }
};

/**
 * Logs a message to a file in the directory specified by the `LOG_DIR` constant.
 * The file name is the current date in the format 'YYYY-MM-DD'.
 *
 * If the file does not exist, creates it.
 *
 * If the file exists, appends the message to it.
 *
 * @param {EnumLogLevel} level - The log level. Can be 'DEBUG', 'INFO', 'WARN', or 'ERROR'.
 * @param {string} message - The message to log.
 */
const log: LogFunction = async (level, message) => {
  await ensureLogDirectory();

  const date = new Date().toISOString().slice(0, 10);
  const filePath = `./logs/${date}.log`;

  // current time in hh:mm:ss format
  const time = new Date().toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });
  const loggedMessage = `${time} [${level}] ${message}\n`;

  try {
    // read log file -> if not error, it exists
    await fs.readFile(filePath, 'utf8');

    // append message to log file
    await fs.appendFile(filePath, loggedMessage);
  }
  catch (error: any) {
    // create new log file and put loggedMessage in it
    if (error.code == "ENOENT") {
      await fs.writeFile(filePath, loggedMessage);
      return;
    }

    console.error("[LOGGING] error.code:", error.code);
  }
}

export default log