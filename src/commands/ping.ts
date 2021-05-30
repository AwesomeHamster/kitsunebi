import { CommandModule } from "../model/command";

export const command = ["ping [option]", "pong [option]"];
export const description = "Ping-Pong测试";
export const builder: CommandModule["builder"] = (yargs) => {
  return yargs.option("detail", {
    alias: ["d"],
    default: false,
  });
};
export const action: CommandModule["action"] = (action) => {
  action.reply(action.command === "ping" ? "pong" : "ping");
};
