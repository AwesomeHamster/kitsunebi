#!/usr/bin/env node
import fs from "fs";
import yargs from "yargs";
import { ConfigFile } from "./model/config";
import { OicqAdapter } from "./adapter";

yargs
  .scriptName("kitsunebi")
  .usage("$0 <command> [options]")
  .command("run", "start running kitsunebi", (yargs) => {
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
  const config = JSON.parse(String(fs.readFileSync(config_path))) as ConfigFile;

  const bot = new OicqAdapter(config);

  bot.on("message", (data) => {
    console.log(data);
  });
}
