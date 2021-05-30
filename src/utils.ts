import fs from "fs";
import { GroupRole } from "oicq";

import { ConfigFile } from "./model/config";

export const Permission = {
  SUPERUSER: 10,
  MANAGER: 9,
  OWNER: 8,
  ADMIN: 7,
  ALPHA: 6,
  BETA: 5,
  EVERYONE: 1,
} as const;

export const readConfigFile = (path: string): ConfigFile => {
  const configFile = JSON.parse(String(fs.readFileSync(path))) as ConfigFile;

  return configFile;
};

export const getUserLevel = (id: number, superuser: number[], role?: GroupRole): number => {
  if (superuser.includes(id)) {
    return Permission.SUPERUSER;
  } else if (role === "owner") {
    return Permission.OWNER;
  } else if (role === "admin") {
    return Permission.ADMIN;
  }
  return Permission.EVERYONE;
};