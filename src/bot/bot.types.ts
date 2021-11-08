export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface Update {
  user: User;
  messageText?: string;
  command?: string;
}
