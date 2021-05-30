#!/usr/bin/env node
import fs from "fs";
import yargs from "yargs";
import { createClient } from "oicq";
import requireAll from "require-all";
import { ConfigFile } from "./model/config";
import { Commander } from "./command";

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
  .alias("h", "help")
  .version()
  .alias("v", "version")
  .argv;

export function start(config_path: string): void {
  const configFile = JSON.parse(String(fs.readFileSync(config_path))) as ConfigFile;

  const bot = createClient(configFile.meta.account.id, configFile.meta.config);

  const commander = new Commander(bot);
  const commandModules = requireAll({
    dirname: __dirname + "/commands",
    filter: /(.+)\.js$/,
    recursive: true,
  });
  Object.values(commandModules).forEach((value) => {
    commander.onCommand(value);
  });

  // let node gently shutdown bots
  process.on("exit", bot.logout.bind(bot));
  process.on("SIGINT", bot.logout.bind(bot));
  process.on("SIGTERM", bot.logout.bind(bot));

  bot.login(configFile.meta.account.password);
}
