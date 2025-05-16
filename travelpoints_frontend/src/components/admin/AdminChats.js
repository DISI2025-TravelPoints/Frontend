import React, { useState, useEffect, useRef } from "react";
import { getEmptyOrAllocatedRooms } from "../../requests/AdminRequests";
import "../../styles/AdminChats.css";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import {
  allocateAdminToChatRoom,
  fetchChatRoomMessages,
} from "../../requests/AdminRequests";
import { Input } from "antd";
const AdminChats = ({ email }) => {
  const [adminChatRooms, setAdminChatRooms] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [selectedChatRoom, setSelectedChatRoom] = useState("");
  const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
  // websocket config
  const stompClientRef = useRef(null);

  const joinChatRoom = async (roomId) => {
    const chatRoom = adminChatRooms.find((room) => room.id === roomId);

    if (chatRoom.recipient == null || chatRoom.recipient.email !== email) {
      await allocateAdminToChatRoom(roomId, email);
    }
  };

  const handleSendMessage = () => {
  if (newMessage.trim() === "" || !selectedChatRoom) return;

  // TODO: Replace with your actual sending logic (e.g., via WebSocket)
  console.log("Sending message:", newMessage);

  // Reset input
  setNewMessage("");
};

  useEffect(() => {
    const socket = new SockJS("http://localhost/chatws");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      stompClient.subscribe("/topic/greetings", (greeting) => {
        console.log("greetings" + greeting.body);
      });
      stompClient.send("/app/chatws", {}, JSON.stringify({ name: "idk" }));
    });
  }, []);

  useEffect(() => {
    async function fetchRooms() {
      const rooms = await getEmptyOrAllocatedRooms(email);
      setAdminChatRooms(rooms);
    }
    fetchRooms();
  }, [email]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatRoom !== "") {
        const msgs = await fetchChatRoomMessages(selectedChatRoom);
        setMessages(msgs);
        console.log(msgs);
      }
    };
    fetchMessages();
  }, [selectedChatRoom]);

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-sidebar">
        <h2>Chat Rooms</h2>
        <ul className="chat-room-list">
          {adminChatRooms && adminChatRooms.length > 0 ? (
            adminChatRooms.map((room) => (
              <li
                key={room.id}
                className="chat-room-item"
                onClick={() => {
                  joinChatRoom(room.id);
                  setSelectedChatRoom(room.id);
                }}
              >
                {room.tourist.name}
              </li>
            ))
          ) : (
            <li>No rooms found</li>
          )}
        </ul>
      </div>

      <div className="admin-chat-content">
        <h2>Messages</h2>
        <div className="message-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-wrapper ${
                msg.sender.role === "Admin" ? "admin-wrapper" : "user-wrapper"
              }`}
            >
              <div className="sender-info">
                {msg.sender.role === "Admin" ? (
                  <>
                    <RiAdminFill className="sender-icon admin-icon" />
                    <span className="sender-name">{msg.sender.name}</span>
                  </>
                ) : (
                  <>
                    <FaUser className="sender-icon user-icon" />
                    <span className="sender-name">{msg.sender.name}</span>
                  </>
                )}
              </div>

              <div
                className={`message-bubble ${
                  msg.sender.role === "Admin" ? "admin-msg" : "user-msg"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        {selectedChatRoom && 
        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message..."
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
        }
      </div>
    </div>
  );
};

export default AdminChats;
