import Axios from "axios";
import { CommandModule } from "../model/command";

interface Hitokoto {
  commit_from: string;
  created_at: string;
  creator: string;
  creator_uid: number;
  from: string;
  from_who: unknown;
  hitokoto: string;
  id: number;
  length: number;
  reviewer: number;
  type: string;
  uuid: string;
}

const API_URL = "https://v1.hitokoto.cn";

const getHitokoto = async (): Promise<Hitokoto> => {
  const resp = await Axios.get(API_URL);
  const json = resp.data as Hitokoto;
  return json;
};

export const command = ["hitokoto", "一言"];
export const description = "回复随机一言";
export const action: CommandModule["action"] = async (action) => {
  try {
    const hitokoto = await getHitokoto();
    action.reply(`『${hitokoto.hitokoto}』\n\t\t\t\t——「${hitokoto.from}」`);
  } catch (error) {
    action.reply("服务出错，请稍后重试");
  }
};
