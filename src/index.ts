#!/usr/bin/env node
import fs from "fs";
import yargs from "yargs";
import { ConfigFile } from "./model/config";
import { OicqAdapter } from "./adapters/oicq";
import { DiscordAdapter } from "./adapters/discord";
import { Adapter } from "./model/adapter";

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

  const bots = config.meta.adapters.map((config): Adapter | undefined => {
    if (config.type === "oicq") {
      return new OicqAdapter(config);
    }
    if (config.type === "discord") {
      return new DiscordAdapter(config);
    }
  });

  bots.forEach((bot) => {
    if (!bot) return;
    bot.on("message", (session) => {
      session.send("reply from kitsunebi");
    });

    // let node gently shutdown bots
    process.on("exit", () => shutdownBots(bot));
    process.on("SIGINT", () => shutdownBots(bot));
    process.on("SIGTERM", () => shutdownBots(bot));
  });
}

function shutdownBots(bot: Adapter) {
  bot.destroy();
}
