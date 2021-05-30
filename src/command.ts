import { Argv } from "yargs";
import { Client, GroupMessageEventData } from "oicq";
import { Action, CommandModule } from "./model/command";
import { User } from "./model/user";
import { getUserLevel } from "./utils";
import { ConfigFile } from "./model/config";

interface CommandEvent {
  bot: Client;
  command: string;
  reply: (message: string) => void;
}

export class Commander {
  private bot: Client;
  private yargs: Argv;
  private config: ConfigFile;

  private commandModules: { [s: string]: CommandModule };

  constructor(bot: Client, yargs: Argv, config: ConfigFile) {
    this.bot = bot;
    this.config = config;
    this.commandModules = {};

    this.yargs = yargs;

    bot.on("message", (data) => {
      if (data.raw_message.startsWith("/")) {
        yargs.parse(
          data.raw_message.substring(1),
          {
            type: data.message_type,
            user: {
              id: data.user_id,
              name: data.sender.nickname,
              level: getUserLevel(data.user_id, this.config.manage.superuser, (data as GroupMessageEventData).sender?.role),
              role: data.message_type === "group" ? data.sender.role : undefined,
            } as User,
            reply: (message: string) => data.reply(message),
          },
          (err, argv, output) => {
            if (output) data.reply(output);
          },
        );
      }
    });
  }

  onCommand(name: string, commandModule: CommandModule): void {
    this.commandModules[name] = commandModule;

    this.yargs.command(
      commandModule.command,
      commandModule.description ?? "",
      commandModule.builder,
      (args) => {
        const command = `${args._[0]}`;
        const currentModule = this.commandModules[command];
        if (currentModule && currentModule.config) {
          const config = currentModule.config;
          if (config.permission && config.permission > (args.user as User).level) {
            (args.reply as Action["reply"])?.("当前权限不足以运行该指令");
            return;
          }
        }
        commandModule.action({
          bot: this.bot,
          command: command,
          reply: (message: string) => {
            (args.reply as Action["reply"])?.(message);
          },
          ...args,
        });
      });
  }
}
