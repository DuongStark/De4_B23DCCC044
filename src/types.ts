import type { ImageSourcePropType } from 'react-native';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type Contact = {
  id: string;
  name: string;
  avatar: ImageSourcePropType;
  online: boolean;
  lastSeen: string;
};

export type Message = {
  id: string;
  text: string;
  time: string;
  mine: boolean;
};

export type Conversation = {
  contactId: string;
  unread: number;
  messages: Message[];
};

export type ChatNotification = {
  id: string;
  contactId?: string;
  title: string;
  content: string;
  time: string;
  read: boolean;
};

export type TabParams = {
  Home: undefined;
  Contacts: undefined;
  Notifications: undefined;
  Settings: undefined;
};

export type RootStackParams = {
  Login: undefined;
  Main: NavigatorScreenParams<TabParams> | undefined;
  Chat: { contactId: string };
};
