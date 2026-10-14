import React, { createContext, useContext, useState } from 'react';
import { initialConversations, initialNotifications } from '../data/demo';
import type { ChatNotification, Conversation, Message } from '../types';

type ChatState = {
  username: string | null;
  conversations: Conversation[];
  notifications: ChatNotification[];
  showOnline: boolean;
  notificationsEnabled: boolean;
  signIn: (username: string) => void;
  signOut: () => void;
  openConversation: (contactId: string) => void;
  sendMessage: (contactId: string, text: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setShowOnline: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
};

const ChatContext = createContext<ChatState | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [conversations, setConversations] = useState(initialConversations);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showOnline, setShowOnline] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  function signOut() {
    setUsername(null);
    setConversations(initialConversations);
    setNotifications(initialNotifications);
    setShowOnline(true);
    setNotificationsEnabled(true);
  }

  function openConversation(contactId: string) {
    setConversations(current => {
      if (!current.some(chat => chat.contactId === contactId)) {
        return [...current, { contactId, unread: 0, messages: [] }];
      }
      return current.map(chat =>
        chat.contactId === contactId ? { ...chat, unread: 0 } : chat,
      );
    });
    setNotifications(current =>
      current.map(notice =>
        notice.contactId === contactId ? { ...notice, read: true } : notice,
      ),
    );
  }

  function sendMessage(contactId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 2000) {
      return;
    }
    const now = new Date();
    const message: Message = {
      id: `${contactId}-${now.getTime()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      text: trimmed,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`,
      mine: true,
    };
    setConversations(current => {
      const existing = current.find(chat => chat.contactId === contactId);
      const updated = {
        contactId,
        unread: 0,
        messages: [...(existing?.messages ?? []), message],
      };
      return [updated, ...current.filter(chat => chat.contactId !== contactId)];
    });
  }

  function markNotificationRead(id: string) {
    setNotifications(current =>
      current.map(notice =>
        notice.id === id ? { ...notice, read: true } : notice,
      ),
    );
  }

  function markAllNotificationsRead() {
    setNotifications(current =>
      current.map(notice => ({ ...notice, read: true })),
    );
  }

  return (
    <ChatContext.Provider
      value={{
        username,
        conversations,
        notifications,
        showOnline,
        notificationsEnabled,
        signIn: value => setUsername(value.trim()),
        signOut,
        openConversation,
        sendMessage,
        markNotificationRead,
        markAllNotificationsRead,
        setShowOnline,
        setNotificationsEnabled,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat requires ChatProvider');
  }
  return context;
}
