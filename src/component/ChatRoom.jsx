import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
// import PropTypes from "prop-types";

const socket = io.connect("https://chit-chat-server-rho.vercel.app");

function ChatRoom({ username, room }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingMsg, setTypingMsg] = useState("");

  const msgEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_typing", (user) => {
       setTypingMsg(`${user} is typing...`);
       setTimeout(() => {
         setTypingMsg("");
       }, 2000);
    })

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
    };
  }, [room]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room,
        author: username,
        massage: message,
        time: new Date().toLocaleTimeString(),
        id: crypto.randomUUID(),
      };

      socket.emit("send_message", messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    }
  };


  const handleTyping = () => {
    socket.emit("typing ", {username, room});
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden mx-4 p-6">
        <h1>
          Room: {room} {username}
        </h1>

        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={` ${
              msg.author === username ? "text-right" : "text-left"
            } mb-4`}
          >
            <span>
              {msg.author}: {msg.massage}
            </span>
            <span>{msg.time}</span>
          </div>
        ))}

        <div ref={msgEndRef} />

        <p>{typingMsg}</p>
        <div>
          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}

            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 mt-6"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

// ChatRoom.prototype = {
//   username: PropTypes.string.isRequired,
//   room: PropTypes.string.isRequired,
//   messages: PropTypes.array.isRequired,
// }

export default ChatRoom;
