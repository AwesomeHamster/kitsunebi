#!/usr/bin/env node
import yargs from "yargs";
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
      });
  }, (argv) => {
    start(argv.config as string);
  })
  .help()
  .locale("zh_CN")
  .alias("h", "help")
  .version()
  .alias("v", "version")
  .argv;

function iterate(array: [string, any][], callback: (key: string, value: any) => void) {
  for (const [key, value] of array) {
    if (value.command) {
      callback(key, value);
    }
    if (typeof value === "object") {
      iterate(Object.entries(value), callback);
    }
  };
};

export function start(config_path: string): void {
  const configFile = readConfigFile(config_path);
  const bot = createClient(configFile.meta.account.id, configFile.meta.config);

  const commander = new Commander(bot, yargs, configFile);
  const commandModules = Object.entries(requireAll({
    dirname: __dirname + "/commands",
    filter: /(.+)\.js$/,
    recursive: true,
  }));
  iterate(commandModules, commander.onCommand.bind(commander));

  // let node gently shutdown bots
  process.on("exit", bot.logout.bind(bot));
  process.on("SIGINT", bot.logout.bind(bot));
  process.on("SIGTERM", bot.logout.bind(bot));

  bot.login(configFile.meta.account.password);
}
