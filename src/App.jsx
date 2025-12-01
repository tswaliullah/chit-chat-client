import { useState } from "react";
import React from "react";
import "./index.css";
import { MessageCircle } from 'lucide-react';
import ChatRoom from "./component/ChatRoom";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (username && room) {
      setJoined(true);
    }
  };

  return (
    <div>
      {!joined ? (
       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-2">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Join Chat Room</h1>
              <p className="text-gray-500">Enter your details to start chatting</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Room Name</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                />
              </div>

              <button
                onClick={joinRoom}
                disabled={!username.trim() || !room.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30"
              >
                Join The Room
              </button>
            </div>

          </div>
        </div>
      </div>
      ) : (
        <ChatRoom username={username} room={room} />
      )}
    </div>
  );
}

export default App;
