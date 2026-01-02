'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebaseClient';
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Smile,
  ArrowLeft,
} from 'lucide-react';

// Types (Unchanged)
interface Conversation {
  id: string;
  otherParticipant: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
  } | null;
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    email: string;
    profile: {
      fullName: string;
      profileImageUrl: string | null;
    } | null;
  };
}

export default function MessagesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        setToken(idToken);
        fetchConversations(idToken);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedConversationId && token) {
      fetchMessages(selectedConversationId, token);
      const interval = setInterval(() => {
        fetchMessages(selectedConversationId, token);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedConversationId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async (authToken: string) => {
    try {
      const res = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string, authToken: string) => {
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !token) return;

    try {
      const res = await fetch(`/api/messages/${selectedConversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages(selectedConversationId, token);
        fetchConversations(token);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Helper to handle back button on mobile
  const handleBackToConversations = () => {
    setSelectedConversationId(null);
  };

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        Please log in to view messages.
      </div>
    );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 relative">
      {/* SIDEBAR 
        - Hidden on mobile if a conversation is selected
        - Visible on Desktop (md:flex) always
      */}
      <div
        className={`
        flex-col border-r bg-white h-full
        w-full md:w-1/3 lg:w-1/4
        ${selectedConversationId ? 'hidden md:flex' : 'flex'}
      `}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversationId(conv.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversationId === conv.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 min-w-[2.5rem] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {conv.otherParticipant?.avatar ? (
                    <img
                      src={conv.otherParticipant.avatar}
                      alt={conv.otherParticipant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      {conv.otherParticipant?.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate pr-2">{conv.otherParticipant?.name}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {conv.lastMessage
                        ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA 
        - Hidden on mobile if NO conversation is selected
        - Visible on Desktop (md:flex) always
      */}
      <div
        className={`
        flex-col h-full bg-gray-50
        w-full md:flex-1 
        ${!selectedConversationId ? 'hidden md:flex' : 'flex'}
      `}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-3 md:p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-2 md:gap-3">
                {/* Back Button (Mobile Only) */}
                <button
                  onClick={handleBackToConversations}
                  className="md:hidden p-1 hover:bg-gray-100 rounded-full text-gray-600"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {selectedConversation.otherParticipant?.avatar ? (
                    <img
                      src={selectedConversation.otherParticipant.avatar}
                      alt={selectedConversation.otherParticipant.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      {selectedConversation.otherParticipant?.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-sm md:text-base">
                    {selectedConversation.otherParticipant?.name}
                  </h2>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-2 md:gap-4 text-gray-500">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => {
                const isMe = msg.senderId !== selectedConversation.otherParticipant?.id;

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 shadow-sm ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm md:text-base break-words">{msg.content}</p>
                      <span
                        className={`text-[10px] md:text-xs mt-1 block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 bg-white border-t sticky bottom-0 z-10">
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <div className="hidden md:flex gap-2">
                  <button type="button" className="text-gray-400 hover:text-gray-600">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button type="button" className="text-gray-400 hover:text-gray-600">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
                {/* Mobile Attachment Toggle (Optional - simplified for now to just Input + Send) */}
                <button type="button" className="md:hidden text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button type="button" className="hidden md:block text-gray-400 hover:text-gray-600">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Smile className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-700">No conversation selected</h3>
            <p className="text-sm">Choose a chat from the sidebar to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
