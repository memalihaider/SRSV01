'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  User,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  Building,
  Filter,
  Star,
  Trash2
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useChatStore, type Message, type Conversation } from "@/stores/chat.store";
import { formatDistanceToNow } from "date-fns";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";

interface FeedbackReply {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

interface Feedback {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceOrProduct: string;
  rating: number;
  comment: string;
  branchId: string;
  branchName: string;
  type: 'service' | 'product';
  createdAt: Date;
  status: 'approved' | 'pending' | 'rejected';
  replies: FeedbackReply[];
}

export default function SuperAdminMessages() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'messages' | 'feedbacks'>('messages');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackBranchFilter, setFeedbackBranchFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    messages,
    activeConversation,
    isLoading,
    setActiveConversation,
    addMessage,
    markConversationAsRead,
    getConversationMessages,
    getBranchConversations,
    getUnreadCount
  } = useChatStore();

  const { playNotificationSound } = useMessageNotifications();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mock data for demonstration
  useEffect(() => {
    if (conversations.length === 0) {
      const mockConversations: Conversation[] = [
        {
          id: '1',
          customerId: 'cust1',
          customerName: 'John Doe',
          customerPhone: '+1234567890',
          customerEmail: 'john@example.com',
          branchId: 'branch1',
          unreadCount: 2,
          createdAt: new Date('2025-12-01T10:00:00'),
          updatedAt: new Date('2025-12-01T14:30:00')
        },
        {
          id: '2',
          customerId: 'cust2',
          customerName: 'Jane Smith',
          customerPhone: '+1234567891',
          customerEmail: 'jane@example.com',
          branchId: 'branch2',
          unreadCount: 1,
          createdAt: new Date('2025-11-30T09:00:00'),
          updatedAt: new Date('2025-12-01T12:00:00')
        },
        {
          id: '3',
          customerId: 'cust3',
          customerName: 'Mike Johnson',
          customerPhone: '+1234567892',
          customerEmail: 'mike@example.com',
          branchId: 'branch1',
          unreadCount: 0,
          createdAt: new Date('2025-11-29T08:00:00'),
          updatedAt: new Date('2025-12-01T11:00:00')
        }
      ];

      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi, I would like to book an appointment for tomorrow',
          senderId: 'cust1',
          senderName: 'John Doe',
          senderType: 'customer',
          branchId: 'branch1',
          timestamp: new Date('2025-12-01T14:00:00'),
          read: false,
          conversationId: '1'
        },
        {
          id: '2',
          content: 'Hello John! I can help you with that. What time works best for you?',
          senderId: 'admin1',
          senderName: 'Branch Admin',
          senderType: 'admin',
          branchId: 'branch1',
          timestamp: new Date('2025-12-01T14:15:00'),
          read: true,
          conversationId: '1'
        },
        {
          id: '3',
          content: 'Around 2 PM would be great',
          senderId: 'cust1',
          senderName: 'John Doe',
          senderType: 'customer',
          branchId: 'branch1',
          timestamp: new Date('2025-12-01T14:30:00'),
          read: false,
          conversationId: '1'
        },
        {
          id: '4',
          content: 'I need to reschedule my haircut appointment',
          senderId: 'cust2',
          senderName: 'Jane Smith',
          senderType: 'customer',
          branchId: 'branch2',
          timestamp: new Date('2025-12-01T12:00:00'),
          read: false,
          conversationId: '2'
        }
      ];

      // Set mock data
      useChatStore.getState().setConversations(mockConversations);
      mockMessages.forEach(msg => useChatStore.getState().addMessage(msg));
    }

    // Set mock feedbacks for all branches
    const mockFeedbacks: Feedback[] = [
      {
        id: 'fb-1',
        customerName: 'Sarah Wilson',
        customerEmail: 'sarah@example.com',
        serviceOrProduct: 'Hair Spa Treatment',
        rating: 5,
        comment: 'Excellent service! Very relaxing and professional staff.',
        branchId: 'branch1',
        branchName: 'Downtown Branch',
        type: 'service',
        createdAt: new Date('2025-12-01T10:00:00'),
        status: 'approved',
        replies: [
          {
            id: 'reply-1',
            text: 'Thank you Sarah! We appreciate your kind words and look forward to seeing you again.',
            author: 'Admin',
            createdAt: new Date('2025-12-01T11:00:00')
          }
        ]
      },
      {
        id: 'fb-2',
        customerName: 'Michael Brown',
        customerEmail: 'michael@example.com',
        serviceOrProduct: 'Premium Face Pack',
        rating: 4,
        comment: 'Great results, will definitely come back.',
        branchId: 'branch2',
        branchName: 'Uptown Branch',
        type: 'product',
        createdAt: new Date('2025-11-30T15:30:00'),
        status: 'approved',
        replies: []
      },
      {
        id: 'fb-3',
        customerName: 'Emma Davis',
        customerEmail: 'emma@example.com',
        serviceOrProduct: 'Manicure Service',
        rating: 3,
        comment: 'Good but could improve on the finishing.',
        branchId: 'branch1',
        branchName: 'Downtown Branch',
        type: 'service',
        createdAt: new Date('2025-11-29T12:00:00'),
        status: 'pending',
        replies: []
      },
      {
        id: 'fb-4',
        customerName: 'Lisa Anderson',
        customerEmail: 'lisa@example.com',
        serviceOrProduct: 'Organic Shampoo',
        rating: 5,
        comment: 'Best shampoo I have used for my hair type!',
        branchId: 'branch3',
        branchName: 'Mall Branch',
        type: 'product',
        createdAt: new Date('2025-11-28T09:15:00'),
        status: 'approved',
        replies: []
      },
      {
        id: 'fb-5',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        serviceOrProduct: 'Massage Therapy',
        rating: 2,
        comment: 'Not satisfied with the service quality.',
        branchId: 'branch2',
        branchName: 'Uptown Branch',
        type: 'service',
        createdAt: new Date('2025-11-27T14:45:00'),
        status: 'rejected',
        replies: []
      },
      {
        id: 'fb-6',
        customerName: 'Robert Taylor',
        customerEmail: 'robert@example.com',
        serviceOrProduct: 'Haircut Premium',
        rating: 4,
        comment: 'Great haircut, very satisfying. Will come again.',
        branchId: 'branch1',
        branchName: 'Downtown Branch',
        type: 'service',
        createdAt: new Date('2025-11-26T16:20:00'),
        status: 'approved',
        replies: []
      }
    ];

    setFeedbacks(mockFeedbacks);
  }, [conversations.length]);

  // Play notification sound for new messages
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      // Super admin gets notified for all customer messages across all branches
      if (message.senderType === 'customer') {
        playNotificationSound();
      }
    };

    // Listen for new messages (in a real app, this would be from WebSocket or similar)
    // For now, we'll check for unread messages periodically
    const checkForNewMessages = () => {
      const currentUnreadCount = getUnreadCount();
      if (currentUnreadCount > 0) {
        // This is a simplified approach - in real implementation,
        // you'd track which messages are new vs already notified
        playNotificationSound();
      }
    };

    // Check every 5 seconds for new messages (simplified polling)
    const interval = setInterval(checkForNewMessages, 5000);

    return () => clearInterval(interval);
  }, [playNotificationSound, getUnreadCount]);

  // Mock branches data
  const branches = [
    { id: 'branch1', name: 'Downtown Branch' },
    { id: 'branch2', name: 'Uptown Branch' },
    { id: 'branch3', name: 'Mall Branch' }
  ];

  const filteredConversations = selectedBranch === 'all'
    ? conversations
    : conversations.filter(c => c.branchId === selectedBranch);

  const activeMessages = activeConversation ? getConversationMessages(activeConversation) : [];
  const unreadCount = getUnreadCount();

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: user?.id || 'super-admin',
      senderName: 'Super Admin',
      senderType: 'admin',
      timestamp: new Date(),
      read: true,
      conversationId: activeConversation
    };

    addMessage(message);
    setNewMessage('');

    // Scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleConversationClick = (conversationId: string) => {
    setActiveConversation(conversationId);
    markConversationAsRead(conversationId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getBranchName = (branchId?: string) => {
    if (!branchId) return 'Unassigned';
    return branches.find(b => b.id === branchId)?.name || 'Unknown Branch';
  };

  const handleApproveFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(fb =>
      fb.id === feedbackId ? { ...fb, status: 'approved' } : fb
    ));
  };

  const handleRejectFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.map(fb =>
      fb.id === feedbackId ? { ...fb, status: 'rejected' } : fb
    ));
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    setFeedbacks(feedbacks.filter(fb => fb.id !== feedbackId));
  };

  const filteredFeedbacks = feedbackBranchFilter === 'all'
    ? feedbacks
    : feedbacks.filter(fb => fb.branchId === feedbackBranchFilter);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating === 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleAddReply = (feedbackId: string) => {
    if (!replyText.trim()) return;

    setFeedbacks(feedbacks.map(fb => {
      if (fb.id === feedbackId) {
        return {
          ...fb,
          replies: [
            ...fb.replies,
            {
              id: 'reply-' + Date.now(),
              text: replyText,
              author: 'Super Admin',
              createdAt: new Date()
            }
          ]
        };
      }
      return fb;
    }));

    setReplyText('');
    setSelectedFeedback(null);
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">All Messages</h1>
                  <p className="text-sm text-gray-600">Monitor conversations across all branches</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="px-2 py-1">
                    {unreadCount} new messages
                  </Badge>
                )}
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'messages' | 'feedbacks')} className="h-full flex flex-col">
              <div className="border-b bg-white">
                <div className="px-4">
                  <TabsList className="grid grid-cols-2 w-fit">
                    <TabsTrigger value="messages" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Messages
                    </TabsTrigger>
                    <TabsTrigger value="feedbacks" className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Feedbacks
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <TabsContent value="messages" className="flex-1 overflow-hidden m-0">
                <div className="h-full flex">
                  {/* Conversations List */}
                  <div className="w-80 border-r bg-white">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <h2 className="font-semibold">All Conversations</h2>
                      </div>

                      {/* Branch Filter */}
                      <div className="mb-4">
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search conversations..."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="p-2">
                        {filteredConversations.map((conversation) => (
                          <div
                            key={conversation.id}
                            onClick={() => handleConversationClick(conversation.id)}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer mb-2 transition-colors",
                              activeConversation === conversation.id
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-gray-50"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt={conversation.customerName} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                  {getInitials(conversation.customerName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm truncate">
                                    {conversation.customerName}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {conversation.lastMessage
                                      ? formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })
                                      : formatDistanceToNow(conversation.createdAt, { addSuffix: true })
                                    }
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 truncate mt-1">
                                  {conversation.lastMessage?.content || 'No messages yet'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Building className="w-3 h-3" />
                                    <span>{getBranchName(conversation.branchId)}</span>
                                  </div>
                                  {conversation.unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                      {conversation.unreadCount}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col">
                    {activeConversation ? (
                      <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white">
                          {(() => {
                            const conversation = conversations.find(c => c.id === activeConversation);
                            return conversation ? (
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt={conversation.customerName} />
                                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                    {getInitials(conversation.customerName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h3 className="font-medium">{conversation.customerName}</h3>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                      <Building className="w-3 h-3" />
                                      {getBranchName(conversation.branchId)}
                                    </span>
                                    {conversation.customerPhone && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {conversation.customerPhone}
                                      </span>
                                    )}
                                    {conversation.customerEmail && (
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {conversation.customerEmail}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {conversation.unreadCount} unread
                                </Badge>
                              </div>
                            ) : null;
                          })()}
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-4">
                            {activeMessages.map((message) => (
                              <div
                                key={message.id}
                                className={cn(
                                  "flex gap-3",
                                  message.senderType === 'admin' ? "justify-end" : "justify-start"
                                )}
                              >
                                {message.senderType === 'customer' && (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt={message.senderName} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                                      {getInitials(message.senderName)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div
                                  className={cn(
                                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                                    message.senderType === 'admin'
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-900"
                                  )}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs opacity-70">
                                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                                    </span>
                                    {message.branchId && (
                                      <span className="text-xs opacity-70 bg-white/20 px-2 py-0.5 rounded">
                                        {getBranchName(message.branchId)}
                                      </span>
                                    )}
                                    {message.senderType === 'admin' && (
                                      <CheckCheck className="w-3 h-3 opacity-70" />
                                    )}
                                  </div>
                                </div>
                                {message.senderType === 'admin' && (
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" alt="Admin" />
                                    <AvatarFallback className="bg-green-100 text-green-600 text-xs font-semibold">
                                      SA
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t bg-white">
                          <div className="flex gap-2">
                            <Input
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              placeholder="Type your message as Super Admin..."
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              className="flex-1"
                            />
                            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                          <p className="text-gray-600">Choose a customer conversation to view messages from all branches</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="feedbacks" className="flex-1 overflow-hidden m-0">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h2 className="font-semibold">All Feedbacks</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={feedbackBranchFilter} onValueChange={setFeedbackBranchFilter}>
                          <SelectTrigger className="w-48">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter by branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-600">{filteredFeedbacks.length} feedbacks</span>
                      </div>
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                      {filteredFeedbacks.length > 0 ? (
                        filteredFeedbacks.map((feedback) => (
                          <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3 flex-1">
                                  <Avatar className="w-10 h-10 flex-shrink-0">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                      {getInitials(feedback.customerName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-medium text-sm">{feedback.customerName}</h3>
                                      <Badge variant="outline" className="text-xs">
                                        {feedback.type === 'service' ? '💼 Service' : '📦 Product'}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        <Building className="w-3 h-3 mr-1" />
                                        {feedback.branchName}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-700 font-semibold mb-2">{feedback.serviceOrProduct}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <Star
                                            key={i}
                                            className={cn(
                                              "w-4 h-4",
                                              i < feedback.rating
                                                ? "fill-yellow-500 text-yellow-500"
                                                : "text-gray-300"
                                            )}
                                          />
                                        ))}
                                      </div>
                                      <span className={cn("text-sm font-medium", getRatingColor(feedback.rating))}>
                                        {feedback.rating}/5
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 italic">"{feedback.comment}"</p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(feedback.createdAt, { addSuffix: true })}
                                      </span>
                                      <Badge className={cn("text-xs", getStatusColor(feedback.status))}>
                                        {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                      </Badge>
                                    </div>

                                    {/* Replies Section */}
                                    {feedback.replies.length > 0 && (
                                      <div className="mt-3 pt-3 border-t space-y-2">
                                        {feedback.replies.map((reply) => (
                                          <div key={reply.id} className="bg-gray-50 p-2 rounded text-sm">
                                            <div className="flex items-center gap-1 mb-1">
                                              <span className="font-medium text-xs text-blue-600">{reply.author}</span>
                                              <span className="text-xs text-gray-500">
                                                {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                                              </span>
                                            </div>
                                            <p className="text-gray-700">{reply.text}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Reply Input */}
                                    {selectedFeedback === feedback.id ? (
                                      <div className="mt-3 pt-3 border-t">
                                        <div className="flex gap-2">
                                          <Input
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="text-sm"
                                          />
                                          <Button
                                            size="sm"
                                            onClick={() => handleAddReply(feedback.id)}
                                            disabled={!replyText.trim()}
                                            className="bg-blue-600 hover:bg-blue-700"
                                          >
                                            Send
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedFeedback(null)}
                                          >
                                            Cancel
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setSelectedFeedback(feedback.id)}
                                        className="mt-3 text-blue-600 hover:text-blue-700"
                                      >
                                        Reply
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2 flex-shrink-0">
                                  {feedback.status !== 'approved' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleApproveFeedback(feedback.id)}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {feedback.status !== 'rejected' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRejectFeedback(feedback.id)}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteFeedback(feedback.id)}
                                    className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-center py-12">
                          <div>
                            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedbacks</h3>
                            <p className="text-gray-600">No feedbacks found for the selected filter</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}