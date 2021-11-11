import { UserInfo } from '../user/user.types';

export interface Update {
  user: UserInfo;
  messageText?: string;
  command?: string;
  messageId: number;
  chatId: number;
  date: number;
}
