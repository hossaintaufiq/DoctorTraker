"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  X,
  Send,
  Search,
  CheckCheck,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  Circle,
  MessageSquare,
  Sparkles,
  Clock,
  User,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MessagesModal() {
  const {
    isMessagesModalOpen,
    setIsMessagesModalOpen,
    conversations,
    chatMessages,
    activeConversationId,
    setActiveConversationId,
    sendChatMessage,
    showToast,
  } = useDoctorTracker();

  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"All" | "Doctor" | "Patient">("All");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  ) || conversations[0];

  const currentMessages = activeConversation
    ? chatMessages[activeConversation.id] || []
    : [];

  useEffect(() => {
    if (isMessagesModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isMessagesModalOpen, currentMessages, activeConversationId]);

  if (!isMessagesModalOpen) return null;

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participantRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      filterRole === "All" ||
      (filterRole === "Doctor" && c.participantRole.toLowerCase().includes("dr")) ||
      (filterRole === "Patient" && !c.participantRole.toLowerCase().includes("dr"));
    return matchesSearch && matchesRole;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    sendChatMessage(activeConversation.id, inputMessage.trim());
    setInputMessage("");
  };

  const handleQuickReply = (text: string) => {
    if (!activeConversation) return;
    sendChatMessage(activeConversation.id, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-3xl w-full max-w-5xl h-[88vh] max-h-[750px] rounded-3xl border border-white/90 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101828] flex items-center gap-2">
                Clinical Communications & Messages
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                  Upcoming Feature
                </span>
              </h2>
              <p className="text-xs text-[#64748B]">
                Direct secure encrypted messaging between hospital staff, doctors, and patients.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMessagesModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-[#64748B] hover:text-[#101828] flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upcoming Feature Notice Banner */}
        <div className="bg-gradient-to-r from-amber-50/90 via-amber-50/70 to-orange-50/80 border-b border-amber-200/60 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Notice:</strong> Real-time clinical messaging is an <strong>upcoming feature</strong> currently available in interactive preview mode.
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/70 text-amber-800 border border-amber-300/70 shrink-0 hidden sm:inline">
            Release v2.5 Soon
          </span>
        </div>

        {/* Content Body: Left sidebar (conversations) + Right chat area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List Sidebar */}
          <div className={cn(
            "w-full sm:w-80 md:w-88 border-r border-slate-100 flex flex-col bg-slate-50/50",
            mobileView === "chat" ? "hidden sm:flex" : "flex"
          )}>
            {/* Search and Filters */}
            <div className="p-3.5 border-b border-slate-100 space-y-2.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-full pl-8 pr-3 py-1.5 text-xs text-[#1E293B] placeholder-slate-400 focus:outline-none focus:border-[#2F65F6] focus:ring-1 focus:ring-[#2F65F6]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="flex items-center gap-1.5">
                {(["All", "Doctor", "Patient"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFilterRole(role)}
                    className={cn(
                      "px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all flex-1",
                      filterRole === role
                        ? "bg-[#2F65F6] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    {role}s
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setMobileView("chat");
                    }}
                    className={cn(
                      "p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3",
                      isSelected
                        ? "bg-white shadow-sm border border-[#2F65F6]/20"
                        : "hover:bg-white/70"
                    )}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2F65F6]/20 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-white">
                        {conv.participantName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      {conv.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#101828] truncate">
                          {conv.participantName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-[#2F65F6] block truncate">
                        {conv.participantRole}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#2F65F6] text-white text-[9px] font-bold flex items-center justify-center shrink-0 self-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400">
                  No conversations match your search.
                </div>
              )}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          {activeConversation ? (
            <div className={cn(
              "flex-1 flex flex-col bg-white",
              mobileView === "list" ? "hidden sm:flex" : "flex"
            )}>
              {/* Active Header */}
              <div className="h-16 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white/90">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobileView("list")}
                    className="sm:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100"
                    aria-label="Back to contacts"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#2F65F6]/10 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-slate-100">
                      {activeConversation.participantName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    {activeConversation.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-[#101828] flex items-center gap-1.5 truncate">
                      <span className="truncate">{activeConversation.participantName}</span>
                      <span className="text-[9px] sm:text-[10px] font-normal px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
                        {activeConversation.participantRole}
                      </span>
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1">
                      {activeConversation.online ? (
                        <>
                          <Circle className="w-2 h-2 fill-[#10B981] text-[#10B981]" />
                          Active Now
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Last active 15 mins ago
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "Voice Call",
                        `Connecting secure hospital VoIP line to ${activeConversation.participantName}...`,
                        "info"
                      )
                    }
                    className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-all"
                    title="Audio Call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        "Telehealth Video",
                        `Launching encrypted telehealth session with ${activeConversation.participantName}...`,
                        "info"
                      )
                    }
                    className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-all"
                    title="Video Consult"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/40 to-white">
                <div className="text-center my-2">
                  <span className="text-[10px] font-medium text-slate-400 bg-white/80 px-3 py-1 rounded-full border border-slate-100 shadow-2xs">
                    Hospital Confidential &bull; End-to-End Encrypted
                  </span>
                </div>

                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[75%]",
                      msg.isSelf ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[10px] font-bold text-slate-500">
                        {msg.senderName}
                      </span>
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div
                      className={cn(
                        "p-3.5 rounded-3xl text-xs leading-relaxed shadow-xs",
                        msg.isSelf
                          ? "bg-[#2F65F6] text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1">
                      {msg.isSelf && (
                        <CheckCheck className="w-3 h-3 text-[#2F65F6]" />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Quick Responses */}
              <div className="px-6 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#2F65F6]" /> Quick reply:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickReply("Appointment confirmed. Please arrive 10 minutes early.")
                  }
                  className="px-2.5 py-1 text-[11px] rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 shrink-0 transition-all"
                >
                  Appointment confirmed
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickReply("Your updated lab diagnostic reports are ready for review.")
                  }
                  className="px-2.5 py-1 text-[11px] rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 shrink-0 transition-all"
                >
                  Lab report ready
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickReply("Prescription has been refilled and sent to the pharmacy.")
                  }
                  className="px-2.5 py-1 text-[11px] rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 shrink-0 transition-all"
                >
                  Prescription sent
                </button>
              </div>

              {/* Message Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-slate-100 flex items-center gap-2 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    showToast("Attachment", "Hospital file & scan attachment dialog opened.", "info")
                  }
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                  title="Attach File / Scan"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={`Reply to ${activeConversation.participantName}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6] focus:ring-1 focus:ring-[#2F65F6] transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="w-10 h-10 rounded-full bg-[#2F65F6] hover:bg-[#1E4FD8] disabled:opacity-40 disabled:hover:bg-[#2F65F6] text-white flex items-center justify-center shadow-xs transition-all shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Select a conversation to begin chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
