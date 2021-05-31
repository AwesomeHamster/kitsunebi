import { CommandModule } from "../../model/command";
import { getNews, NewsCategory, NewsRagion } from "./utils";

export const command = ["lodestone <category> [option]", "ls"];
export const description = "显示国际服的各种新闻";
export const builder: CommandModule["builder"] = (yargs) => {
  return yargs
    .positional("category", {
      choices: [
        "topics",
        "notices",
        "maintenance",
        "updates",
        "status",
        "developers",
      ],
    })
    .option("ragion", {
      alias: "r",
      choices: [
        "jp",
        "eu",
        "na",
        "fr",
        "de",
      ],
      default: "jp",
      requiresArg: false,
    });
};
export const action: CommandModule["action"] = async (action) => {
  const news = (await getNews(5, action.category as NewsCategory, action.ragion as NewsRagion))
    .map((item) => `${item.title}\n${item.url}`)
    .join("\n\n");
  action.reply(news);
};
