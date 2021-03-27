#!/usr/bin/env node
import fs from "fs";
import yargs from "yargs";
import { createClient } from "oicq";
import { ConfigFile } from "./model/config";

yargs
  .scriptName("kitsunebi")
  .usage("$0 <command> [options]")
  .command("start", "start running kitsunebi", (yargs) => {
    yargs
      .option("config", {
        alias: "c",
        default: "config.json",
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

  // let node gently shutdown bots
  process.on("exit", bot.terminate);
  process.on("SIGINT", bot.terminate);
  process.on("SIGTERM", bot.terminate);
}
