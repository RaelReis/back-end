import { Diary } from "./Diaries";
import { Weekly } from "./Weeklies";

export interface User {
  id: string;
  discord_id: string;
  username: string;
  avatar: string;
  diaries: Diary[];
  weeklies: Weekly[];
  createdAt: string;
  updatedAt: string;
}
