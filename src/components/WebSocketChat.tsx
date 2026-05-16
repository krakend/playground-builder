"use client";
import React, { useRef, useState } from "react";

/**
 * WebSocket chat client used inside the chat-ws-room MDX page. Lets the user
 * connect to a room on the gateway, send messages, and see broadcasts.
 */
const WebSocketChat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [room, setRoom] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    if (!room.trim()) {
      setError("Room name cannot be empty");
      return;
    }

    setError(null);
    setIsConnected(false);

    if (socketRef.current) {
      socketRef.current.close();
    }

    const wsUrl = `ws://localhost:8080/chat/ws/${room}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => setIsConnected(true);
    socketRef.current.onerror = () =>
      setError("Failed to connect to WebSocket. Please try again.");
    socketRef.current.onclose = () => setIsConnected(false);
    socketRef.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
  };

  const sendMessage = () => {
    if (socketRef.current && message.trim() !== "") {
      socketRef.current.send(message);
      setMessage("");
    }
  };

  return (
    <div className="not-prose my-6">
      <div className="ws-chat">
        <div className="ws-chat__row">
          <div className="ws-chat__input-group">
            <span className="ws-chat__prefix">ws://localhost:8080/chat/ws/</span>
            <input
              placeholder="room-name"
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="ws-chat__input"
            />
          </div>
          <button onClick={connectWebSocket} className="button--primary">
            {isConnected ? "Reconnect" : "Connect"}
          </button>
        </div>

        {error && (
          <p className="ws-chat__status ws-chat__status--error">{error}</p>
        )}
        {isConnected && (
          <p className="ws-chat__status ws-chat__status--ok">
            <span className="ws-chat__dot" /> Connected to room: {room}
          </p>
        )}

        {isConnected && (
          <>
            <div className="ws-chat__messages">
              {messages.length === 0 ? (
                <p className="ws-chat__empty">No messages yet…</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="ws-chat__message">
                    {msg}
                  </div>
                ))
              )}
            </div>
            <div className="ws-chat__compose">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message…"
                className="ws-chat__compose-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <button onClick={sendMessage} className="button--primary">
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WebSocketChat;
