import { load as cheerioLoad } from "cheerio";

import { CommandModule } from "../../model/command";
import { getNews, getWebpage } from "./utils";

export const getMaintenanceTime = async (): Promise<string | undefined> => {
  try {
    const news = await getNews(10, "maintenance");
    const mainten = news.find((item) => item.title.includes("全ワールド メンテナンス作業"));
    if (!mainten) return;
    const html = await getWebpage(mainten.url.replace(/^http(?!s)/, "https"));
    const $ = cheerioLoad(html);
    const text = $("div.news__detail__wrapper").text();
    const matches =
      /(?<date>\d{4}年\d+月\d+日).* (?<jptimestart>\d{1,2}:\d{1,2})より(?<jptimeend>\d{1,2}:\d{1,2}).*まで/gi.exec(text);
    if (matches) {
      return `${matches.groups?.date}  ${matches.groups?.jptimestart} - ${matches.groups?.jptimeend}`;
    }
  } catch (error) {
    return;
  }
};

export const command = ["lodestonemaintenance", "国际服维护", "国际服维护时间", "lsmt", "维护时间"];
export const description = "显示最新国际服维护时间";
export const action: CommandModule["action"] = async (action) => {
  action.reply(await getMaintenanceTime() ?? "服务出错，请稍后重试");
};
