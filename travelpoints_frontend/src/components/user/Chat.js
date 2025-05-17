import { React, useState, useEffect, useRef } from "react";
import { fetchTouristChatRooms } from "../../requests/TouristRequests";
import { getEmailFromToken } from "../../utils/Auth";
import { fetchChatRoomMessages } from "../../requests/AdminRequests";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import "../../styles/Chat.css";
import "../../styles/AdminChats.css";
import { useWebSocket } from "../../utils/WebSocketContext";

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const email = getEmailFromToken();
  const stompClientRef = useWebSocket();

  const sendMessage = () => {
   
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
    const fetchChatRooms = async () => {
      if (!email) return;
      try {
        const rooms = await fetchTouristChatRooms(email);
        setChatRooms(rooms);
      } catch (err) {
        console.error("Failed to fetch chat rooms:", err);
      }
    };

    fetchChatRooms();
  }, [email]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatRoom) {
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
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>Chat Rooms</h3>
        {chatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => {
              setSelectedChatRoom(room.id);
              setRecipientEmail(room.admin.email);
            }}
            className={`chat-room-item ${
              selectedChatRoom?.id === room.id ? "active" : ""
            }`}
          >
            Room #{room.attractionId}
          </div>
        ))}
      </div>

      <div className="chat-window">
        {selectedChatRoom ? (
          <>
            <div className="message-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-wrapper ${
                    msg.sender.role === "Admin"
                      ? "admin-wrapper"
                      : "user-wrapper"
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
            <div className="chat-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="chat-input"
                placeholder="Type your message..."
              />
              <button onClick={sendMessage} className="chat-send-button">
                Send
              </button>
            </div>
          </>
        ) : (
          <p style={{ padding: "1rem" }}>
            Select a chat room to start chatting.
          </p>
        )}
      </div>
    </div>
  );
};
export default Chat;
