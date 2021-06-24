import { CommandModule } from "../model/command";
import { Permission } from "../utils";

export const command = ["echo <message..>"];
export const description = "复读任何话语";
export const builder: CommandModule["builder"] = (yargs) => {
  return yargs.positional("message", {
    type: "string",
  });
};
export const action: CommandModule["action"] = (action) => {
  action.reply((action.message as string[]).join(" "));
};

export const config = {
  permission: Permission.ADMIN,
};
