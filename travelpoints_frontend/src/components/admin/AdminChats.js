import React, { useState, useEffect, useRef } from "react";
import { getEmptyOrAllocatedRooms } from "../../requests/AdminRequests";
import "../../styles/AdminChats.css";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
import { allocateAdminToChatRoom,fetchChatRoomMessages } from "../../requests/AdminRequests";
const AdminChats = ({ email }) => {
  const [adminChatRooms, setAdminChatRooms] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  // websocket config
  const stompClientRef = useRef(null);

  const joinChatRoom = async (roomId) => {
      const chatRoom = adminChatRooms.find((room) => room.id === roomId);

    if (chatRoom.recipient == null || chatRoom.recipient.email !== email) {
    await allocateAdminToChatRoom(roomId, email);
  }
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

  useEffect( ()=>{
    const fetchMessages = async (selectedChatRoom)=>{
        const msgs =  await fetchChatRoomMessages(selectedChatRoom);
        setMessages(msgs);
    }
    fetchMessages(selectedChatRoom); 
  },[selectedChatRoom]);

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
                {room.sender.name}
              </li>
            ))
          ) : (
            <li>No rooms found</li>
          )}
        </ul>
      </div>

      <div className="admin-chat-content">
        <h2>Messages</h2>
        {/* Add message display or input components here */}
      </div>
    </div>
  );
};

export default AdminChats;
