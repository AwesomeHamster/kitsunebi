import { CommandModule } from "../model/command";

export const command = ["echo <message..>"];
export const description = "echo every thing you said";
export const builder: CommandModule["builder"] = (yargs) => {
  return yargs.positional("message", {
    default: "echo",
    type: "string",
  });
};
export const action: CommandModule["action"] = (action) => {
  action.reply((action.message as string[]).join(" "));
};

export const config = {
  permission: 9,
}
