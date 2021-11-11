export interface UserMessageEntity {
  messageId: number;
  text: string;
  date: number;
  isBot: boolean;
}

export interface UserChatEntity {
  chatId: number;
  messages: UserMessageEntity[];
}

export interface UserInfo {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
}
