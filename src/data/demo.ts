import type { ChatNotification, Contact, Conversation } from '../types';

export const contacts: Contact[] = [
  {
    id: 'ngoc',
    name: 'Bảo Ngọc',
    avatar: require('../assets/ngoc.jpg'),
    online: true,
    lastSeen: 'Đang hoạt động',
  },
  {
    id: 'nam',
    name: 'Hoàng Nam',
    avatar: require('../assets/nam.jpg'),
    online: true,
    lastSeen: 'Đang hoạt động',
  },
  {
    id: 'anh',
    name: 'Quỳnh Anh',
    avatar: require('../assets/anh.jpg'),
    online: false,
    lastSeen: 'Hoạt động 15 phút trước',
  },
  {
    id: 'duc',
    name: 'Minh Đức',
    avatar: require('../assets/duc.jpg'),
    online: true,
    lastSeen: 'Đang hoạt động',
  },
  {
    id: 'linh',
    name: 'Khánh Linh',
    avatar: require('../assets/linh.jpg'),
    online: false,
    lastSeen: 'Hoạt động 1 giờ trước',
  },
  {
    id: 'huy',
    name: 'Gia Huy',
    avatar: require('../assets/huy.jpg'),
    online: false,
    lastSeen: 'Hoạt động hôm qua',
  },
];

export const initialConversations: Conversation[] = [
  {
    contactId: 'ngoc',
    unread: 2,
    messages: [
      {
        id: 'ngoc-1',
        text: 'Chiều nay bạn có rảnh không?',
        time: '09:32',
        mine: false,
      },
      {
        id: 'ngoc-2',
        text: 'Có nè. Bạn có kế hoạch gì chưa?',
        time: '09:33',
        mine: true,
      },
      {
        id: 'ngoc-3',
        text: 'Mình mới tìm được một quán cà phê xinh lắm.',
        time: '09:40',
        mine: false,
      },
      {
        id: 'ngoc-4',
        text: 'Chiều đi cà phê nhé ☕',
        time: '09:41',
        mine: false,
      },
    ],
  },
  {
    contactId: 'nam',
    unread: 1,
    messages: [
      { id: 'nam-1', text: 'Ảnh hôm qua đẹp quá!', time: '09:10', mine: true },
      {
        id: 'nam-2',
        text: 'Để mình gửi bạn mấy tấm nữa nhé.',
        time: '09:18',
        mine: false,
      },
    ],
  },
  {
    contactId: 'anh',
    unread: 0,
    messages: [
      {
        id: 'anh-1',
        text: 'Mai mình gặp nhau lúc 8 giờ nhé?',
        time: '08:50',
        mine: false,
      },
      {
        id: 'anh-2',
        text: 'Oke, hẹn bạn ngày mai!',
        time: '08:54',
        mine: true,
      },
    ],
  },
  {
    contactId: 'duc',
    unread: 3,
    messages: [
      {
        id: 'duc-1',
        text: 'Bài thuyết trình đến đâu rồi bạn?',
        time: '08:20',
        mine: true,
      },
      {
        id: 'duc-2',
        text: 'Mình vừa làm xong phần mở đầu.',
        time: '08:22',
        mine: false,
      },
      {
        id: 'duc-3',
        text: 'Bạn xem giúp mình bố cục với.',
        time: '08:24',
        mine: false,
      },
      {
        id: 'duc-4',
        text: 'Mình gửi tài liệu rồi nha',
        time: '08:25',
        mine: false,
      },
    ],
  },
  {
    contactId: 'linh',
    unread: 0,
    messages: [
      {
        id: 'linh-1',
        text: 'Cuối tuần đi dạo một chút không?',
        time: '08:05',
        mine: true,
      },
      {
        id: 'linh-2',
        text: 'Cuối tuần này mình rảnh đó 🌿',
        time: '08:12',
        mine: false,
      },
    ],
  },
];

export const initialNotifications: ChatNotification[] = [
  {
    id: 'notice-1',
    contactId: 'ngoc',
    title: 'Tin nhắn mới',
    content: 'Bảo Ngọc đã gửi cho bạn 2 tin nhắn.',
    time: '09:41',
    read: false,
  },
  {
    id: 'notice-2',
    contactId: 'nam',
    title: 'Tin nhắn mới',
    content: 'Hoàng Nam đã gửi cho bạn một tin nhắn.',
    time: '09:18',
    read: false,
  },
  {
    id: 'notice-3',
    contactId: 'duc',
    title: 'Tin nhắn mới',
    content: 'Minh Đức đã gửi cho bạn 3 tin nhắn.',
    time: '08:25',
    read: false,
  },
  {
    id: 'notice-4',
    title: 'Chào mừng đến với Mây',
    content: 'Tài khoản của bạn đã sẵn sàng. Bắt đầu một cuộc trò chuyện nhé.',
    time: 'Hôm qua',
    read: true,
  },
];
