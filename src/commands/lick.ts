import Axios from "axios";
import { CommandModule } from "../model/command";

type Chp = string;

const API_URL = "https://chp.shadiao.app/api.php";

const getChp = async (): Promise<Chp> => {
  const resp = await Axios.get(API_URL, {
    responseType: "text",
  });
  const text = resp.data as Chp;
  return text;
};

export const command = ["lick", "舔", "跪舔", "lap"];
export const description = "回复随机彩虹屁";
export const action: CommandModule["action"] = async (action) => {
  try {
    const chp = await getChp();
    action.reply(chp);
  } catch (error) {
    action.reply("服务出错，请稍后重试");
  }
};
