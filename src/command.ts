import yargs, { Argv } from "yargs";
import { Client } from "oicq";
import { Action, CommandModule } from "./model/command";

interface CommandEvent {
  bot: Client;
  command: string;
  reply: (message: string) => void;
}

export class Commander {
  private bot: Client;
  private yargs: Argv;

  constructor(bot: Client) {
    this.bot = bot;

    this.yargs = yargs;

    bot.on("message", (data) => {
      if (data.raw_message.startsWith("/")) {
        yargs.parse(
          data.raw_message.substring(1),
          {
            type: data.message_type,
            id: data.message_type === "group" ? data.group_id : data.user_id,
            reply: (message: string) => data.reply(message),
          },
          (err, argv, output) => {
            if (output) data.reply(output);
          },
        );
      }
    });
  }

  onCommand(action: CommandModule): void {
    yargs.command(
      action.command,
      action.description ?? "",
      action.builder,
      (args) => {
        action.action({
          bot: this.bot,
          command: `${args._[0]}`,
          reply: (message: string) => {
            (args.reply as Action["reply"])?.(message);
          },
          ...args,
        });
      });
  }
}
