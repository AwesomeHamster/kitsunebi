import yargs from "yargs";
import nodeGlobalProxy from "node-global-proxy";
import { createClient } from "oicq";
import requireAll from "require-all";
import { Commander } from "./command";
import { readConfigFile } from "./utils";

yargs
  .scriptName("kitsunebi")
  .usage("$0 <command> [options]")
  .command("start", "start running kitsunebi", (yargs) => {
    yargs
      .option("config", {
        alias: "c",
        default: "config.json",
        hidden: true,
      })
      .option("proxy", {
        alias: "x",
        default: undefined,
        requiresArg: false,
        hidden: true,
      });
  }, (argv) => {
    start(argv.config as string, argv.proxy as string);
  })
  .help()
  .locale("zh_CN")
  .alias("h", "help")
  .version()
  .alias("v", "version")
  .argv;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function iterate(array: [string, any][], callback: (key: string, value: any) => void) {
  for (const [key, value] of array) {
    if (value.command) {
      callback(key, value);
    }
    if (typeof value === "object") {
      iterate(Object.entries(value), callback);
    }
  }
}

export function start(config_path: string, proxy?: string): void {
  const configFile = readConfigFile(config_path);
  const bot = createClient(configFile.meta.account.id, configFile.meta.config);

  const commander = new Commander(bot, yargs, configFile);
  const commandModules = Object.entries(requireAll({
    dirname: __dirname + "/commands",
    filter: /(.+)\.js$/,
    recursive: true,
  }));
  iterate(commandModules, commander.onCommand.bind(commander));

  if (proxy) {
    nodeGlobalProxy.setConfig({
      http: proxy,
      https: proxy,
    });
    nodeGlobalProxy.start();
    console.log(`proxy enabled with ${proxy}`);
  }

  // let node gently shutdown bots
  process.on("exit", bot.logout.bind(bot));
  process.on("SIGINT", bot.logout.bind(bot));
  process.on("SIGTERM", bot.logout.bind(bot));

  bot.login(configFile.meta.account.password);
}
