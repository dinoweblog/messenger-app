import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import "./Styles/Messenger.css";
import { FiSend } from "react-icons/fi";

export const MessagePanel = ({
  userId,
  secondUserId,
  conversationId,
  socket,
}) => {
  const [allMsg, setAllMsg] = useState([]);
  const [receiveMsg, setReceiveMsg] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getAllMsg();
  }, [conversationId]);

  useEffect(() => {
    setAllMsg((prev) => [...prev, receiveMsg]);
  }, [receiveMsg]);

  const getAllMsg = () => {
    fetch(`https://messenger-d.herokuapp.com/messages/${conversationId}`)
      .then((res) => res.json())
      .then((res) => {
        setAllMsg(res);
      });

    socket.current.on("getMsg", (data) => {
      setReceiveMsg(data);
    });
  };

  const sendMessageHandle = () => {
    fetch(`https://messenger-d.herokuapp.com/messages`, {
      method: "POST",
      body: JSON.stringify({
        conversationId: conversationId,
        sender: userId,
        text: message,
      }),
      headers: {
        "Content-Type": "Application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setMessage("");
      });

    socket.current.emit("sendMsg", {
      sender: userId,
      receiverId: secondUserId,
      text: message,
    });
  };

  return (
    <div className="conversation_field">
      <Navbar text={"messenger"} />

      <div className="conversation">
        {allMsg.map((msg, i) => (
          <p
            key={i}
            className={msg?.sender == userId ? "senderMsg" : "receiverMsg"}
          >
            <span>{msg?.text}</span>
          </p>
        ))}
      </div>
      <div className="msg_field">
        <input
          value={message}
          type="text"
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={() => {
            sendMessageHandle();
          }}
        >
          <FiSend style={{ fontSize: "2.3rem", color: "#6173ce" }} />
        </button>
      </div>
    </div>
  );
};
