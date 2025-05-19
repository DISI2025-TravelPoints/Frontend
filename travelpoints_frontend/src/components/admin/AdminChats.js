import React, { useState, useEffect, useRef } from "react";
import { getEmptyOrAllocatedRooms } from "../../requests/AdminRequests";
import { useWebSocket } from "../../utils/WebSocketContext";
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
import { getEmailFromToken } from "../../utils/Auth";
import { useNavigate } from "react-router-dom";
const AdminChats = ({ email }) => {
  const [adminChatRooms, setAdminChatRooms] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [selectedChatRoom, setSelectedChatRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const navigate = useNavigate();
  // websocket config
  const stompClientRef = useWebSocket();

  const joinChatRoom = async (roomId) => {
    const chatRoom = adminChatRooms.find((room) => room.id === roomId);

    if (chatRoom.recipient == null || chatRoom.recipient.email !== email) {
      await allocateAdminToChatRoom(roomId, email);
    }
  };

  const handleSendMessage = () => {
    if (newMessage !== "" && recipientEmail !== "") {
      const message = {
        content: newMessage,
        recipientEmail: recipientEmail,
        senderEmail: email,
        chatRoomId: selectedChatRoom,
      };
      
      if (stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: "/app/chatws",
          body: JSON.stringify(message),
        });
      }
      setNewMessage("");
    }
  };

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
    let subscription;

    if (stompClientRef && stompClientRef.current && selectedChatRoom !== "") {
      subscription = stompClientRef.current.subscribe(
        `/topic/chatroom.${selectedChatRoom}`,
        (msg) => {
          const chatMessage = JSON.parse(msg.body);
          console.log("Received message:", chatMessage);
          setMessages((prevMessages) => [...prevMessages, chatMessage]);
        }
      );
    }
  }, [selectedChatRoom]);

  return (
    <div className="admin-chat-container">
      <div className="admin-chat-sidebar">
        <h2>Chat Rooms</h2>
        {selectedChatRoom && (
          <div className="attraction-info-banner">
            <span>Chat about Attraction:</span>
            <button
              className="go-to-attraction-button"
              onClick={() => {
                const room = adminChatRooms.find(
                  (room) => room.id === selectedChatRoom
                );
                if (room?.attractionId) {
                  navigate(`/attractions/${room.attractionId}`);
                }
              }}
            >
              View Attraction
            </button>
          </div>
        )}
        <ul className="chat-room-list">
          {adminChatRooms && adminChatRooms.length > 0 ? (
            adminChatRooms.map((room) => (
              <li
                key={room.id}
                className="chat-room-item"
                onClick={() => {
                  joinChatRoom(room.id);
                  setSelectedChatRoom(room.id);
                  setRecipientEmail(room.tourist.email);
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
        <hr></hr>
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
        {selectedChatRoom && (
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
        )}
      </div>
    </div>
  );
};

export default AdminChats;
