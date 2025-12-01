import React, { useRef, useEffect, useState } from "react";
import { Send, Users, MessageCircle } from "lucide-react";
import io from "socket.io-client";

// const socket = io.connect("https://chit-chat-server-kappa.vercel.app");
const socket = io.connect("http://localhost:3000");

function ChatRoom({ username = "User", room = "general" }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingMsg, setTypingMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const msgEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", room);

    const handleReceiveMessage = (data) => {
      // Only add message if it's not from yourself (to avoid duplicates)
      if (data.author !== username) {
        setMessages((prev) => [...prev, data]);
      }
    };

    const handleUserTyping = (user) => {
      if (user !== username) {
        setTypingMsg(`${user} is typing...`);
        setTimeout(() => {
          setTypingMsg("");
        }, 2000);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user_typing", handleUserTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_typing", handleUserTyping);
    };
  }, [room, username]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room,
        author: username,
        massage: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: crypto.randomUUID(),
      };

      // Add your own message immediately to the UI
      setMessages((prev) => [...prev, messageData]);
      
      // Send to server so others receive it
      socket.emit("send_message", messageData);
      
      setMessage("");
      setIsTyping(false);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { username, room });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[100vh] sm:h-[700px] bg-white/95 backdrop-blur-xl sm:rounded-3xl rounded-none shadow-2xl flex flex-col overflow-hidden border-0 sm:border sm:border-white/20">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-lg">{room}</h1>
              <p className="text-indigo-100 text-xs sm:text-sm flex items-center gap-1">
                <Users className="w-2 h-2 sm:w-3 sm:h-3" />
                {username}
              </p>
            </div>
          </div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-base sm:text-lg font-medium">No messages yet</p>
                <p className="text-gray-300 text-xs sm:text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.author === username ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`max-w-[85%] sm:max-w-[70%] ${msg.author === username ? "items-end" : "items-start"} flex flex-col`}>
                  <span className="text-xs text-gray-500 mb-1 px-1">
                    {msg.author === username ? "You" : msg.author}
                  </span>
                  <div
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-md ${
                      msg.author === username
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                    }`}
                  >
                    <p className="break-words text-sm sm:text-base">{msg.massage}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              </div>
            ))
          )}
          <div ref={msgEndRef} />
        </div>

        {/* Typing Indicator */}
        {typingMsg && (
          <div className="px-3 sm:px-6 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 italic">{typingMsg}</span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 sm:p-6 bg-white border-t border-gray-100">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={message}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;