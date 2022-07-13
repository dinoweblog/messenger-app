import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Navbar } from "./Navbar";
import "./Styles/Messenger.css";
import moment from "moment";
import Moment from "react-moment";

export const MessagePanel = ({
  userId,
  secondUser,
  conversationId,
  socket,
  onlineUser,
}) => {
  const [allMsg, setAllMsg] = useState([]);
  const [receiveMsg, setReceiveMsg] = useState(null);
  const [message, setMessage] = useState("");
  const [online, setOnline] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    setOnline(false);
  }, [secondUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, allMsg]);

  useEffect(() => {
    getAllMsg();
  }, [conversationId]);

  useEffect(() => {
    for (let i = 0; i < onlineUser.length; i++) {
      console.log(onlineUser[i].userId, secondUser._id);
      if (onlineUser[i].userId == secondUser._id) setOnline(true);
    }
  }, [secondUser, onlineUser]);

  useEffect(() => {
    setAllMsg((prev) => [...prev, receiveMsg]);
  }, [receiveMsg]);

  console.log("onlineUser", onlineUser);

  const getAllMsg = () => {
    fetch(`https://messenger-d.herokuapp.com/messages/${conversationId}`)
      .then((res) => res.json())
      .then((res) => {
        setAllMsg(res);
      });

    socket.current.on("getMsg", (data) => {
      console.log(data);
      setReceiveMsg(data);
    });
  };

  console.log("onlne", online);

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
      receiverId: secondUser._id,
      text: message,
      createdAt: new Date().toLocaleString().toString(),
    });
  };

  return (
    <div className="conversation_field">
      <Navbar
        user={secondUser.firstname + " " + secondUser.lastname}
        online={online}
      />

      <div className="conversation">
        {allMsg.map((msg, i) => (
          <p
            key={i}
            className={msg?.sender == userId ? "senderMsg" : "receiverMsg"}
          >
            <span>{msg?.text}</span> <br />
            <i>{moment(msg?.createdAt).format("hh:mm A")}</i>
          </p>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="msg_field">
        <input
          value={message}
          type="text"
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.which === 13) {
              sendMessageHandle();
            }
          }}
        />
        <button
          onClick={() => {
            sendMessageHandle();
          }}
        >
          <i className="bx bx-send"></i>
        </button>
      </div>
    </div>
  );
};
