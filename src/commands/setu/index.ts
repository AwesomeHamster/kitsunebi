import Booru from "booru";
import Post from "booru/dist/structures/Post";
import SearchResults from "booru/dist/structures/SearchResults";
import { MessageElem } from "oicq";
import { CommandModule } from "../../model/command";
import { User } from "../../model/user";

export const command = ["setu <keyword..> [option]"];
export const description = "从图库中获取图片";
export const builder: CommandModule["builder"] = (yargs) => {
  return yargs
    .positional("keyword", {
      type: "string",
      default: "*",
      demandOption: false,
    })
    .option("count", {
      alias: ["n"],
      type: "number",
      default: 1,
      requiresArg: false,
    });
};
export const action: CommandModule["action"] = async (action) => {
  const keyword = (action.keyword as string)
    .split("|")
    .map((item) => `*${item.trim().replace(" ", "_")}*`);
  const posts = await getSetu(keyword);

  if (posts) {
    const message: Array<MessageElem> = Array.from([{
      "type": "at",
      "data": {
        "qq": (action.user as User).id,
      },
    }]);

    const sendingPost: {
      url: string;
      source: string;
      domain: string;
    }[] = [];
    while(sendingPost.length < Math.min(5, action.count as number)) {
      const post = posts.pop();
      const url = post?.sampleUrl ?? post?.fileUrl ?? post?.previewUrl;
      if (url) sendingPost.push({
        "url": url,
        "source": (Array.isArray(post?.source) ? post?.source[0] : post?.source) ?? "null",
        "domain": post?.booru.domain ?? "null",
      });
      if (posts.length <= 0) break;
    }

    sendingPost.forEach((post) => {
      message.push({
        type: "image",
        data: {
          file: post.url,
        },
      }, {
        type: "text",
        data: {
          text: `source: ${post.source}\nPowered by ${post.domain}`,
        },
      });
    });

    if(sendingPost.length <= 0) {
      message.push({
        type: "text",
        data: {
          text: `找不到 tag 为${action.keyword}的图片`,
        },
      });
    }

    await action.reply(message);
    return;
  }
  await action.reply("服务出错，请稍后重试");
};

const sites = [
  "danbooru",
  "konachan.com",
  "yandere",
  "gelbooru",
  "safebooru",
  "tbib",
];

const getSetu = async (tag: string | string[] = "*"): Promise<Post[] | null> => {
  try {
    const resp = (await Promise.allSettled(sites.map((site) => Booru(site).search(tag, { limit: 50 }))))
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<SearchResults>).value);
    const posts: Post[] = [];
    resp.forEach((result) => result.forEach((item) => posts.push(item)));
    return posts.sort(() => 0.5 - Math.random());
  } catch (error) {
    return null;
  }
};
