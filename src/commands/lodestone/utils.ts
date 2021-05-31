import Axios from "axios";

export type NewsCategory = "topic" | "notices" | "maintenance" | "updates" | "status" | "developers";
export type NewsRagion = "na" | "jp" | "eu";

export const getNews = async (count: number, category: NewsCategory = "topic", ragion: NewsRagion = "jp") => {
  const url = `http://${ragion}.lodestonenews.com/news/${category}`;
  const json = (await Axios.get(url)).data as { title: string, url: string }[];
  if (json.length > count) return json.slice(0, count);
  return json;
}

export const getWebpage = async (url: string): Promise<string> => {
  return (await Axios.get(url, {
    responseType: "text",
  })).data as string;
}
