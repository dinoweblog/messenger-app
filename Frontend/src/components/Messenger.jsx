import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Initial } from "./Initial";
import { MessagePanel } from "./MessagePanel";
import "./Styles/Messenger.css";
import { io } from "socket.io-client";

import { useRef } from "react";
import { Navbar } from "./Navbar";

export const Messenger = () => {
  const [allusers, setAllusers] = useState([]);
  const [secondUser, setSecondUser] = useState({});
  const [onlineUser, setOnlineUser] = useState([]);
  const [conversationId, setConversationId] = useState();

  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(null);

  const socket = useRef();
  const { userId, user } = useSelector((state) => state.login);

  useEffect(() => {
    document.title = "messenger";
  }, []);

  useEffect(() => {
    socket.current = io("https://messenger-d.herokuapp.com");
  }, []);

  useEffect(() => {
    socket.current.emit("user", userId);
    socket.current.on("getUsers", (user) => {
      console.log(user);
      setOnlineUser(user);
    });
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    fetch(`https://messenger-d.herokuapp.com/allUsers`)
      .then((res) => res.json())
      .then((res) => {
        setAllusers(res);
      });
  };

  const conversationHandle = (receiverId) => {
    fetch(`https://messenger-d.herokuapp.com/conversation`, {
      method: "POST",
      body: JSON.stringify({ senderId: userId, receiverId: receiverId }),
      headers: {
        "Content-Type": "Application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setConversationId(res?._id);
      });
  };

  const getConversationId = (receiverId) => {
    fetch(
      `https://messenger-d.herokuapp.com/conversation/find/${userId}/${receiverId}`
    )
      .then((res) => res.json())
      .then((res) => {
        res ? setConversationId(res._id) : conversationHandle(receiverId);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container">
      <div className="message_container">
        <div className="all_user_div">
          <Navbar user={user.firstname + " " + user.lastname} />
          {allusers.map((u, i) =>
            userId != u._id ? (
              <div key={u._id} className="user_list">
                <button
                  className={active && index === i ? "active" : ""}
                  onClick={() => {
                    setSecondUser(u);
                    getConversationId(u._id);
                    setActive(true);
                    setIndex(i);
                    // conversationHandle(u._id);
                  }}
                >
                  <span> {u.firstname.slice(0, 2).toUpperCase()} </span>
                  {u.firstname} {u.lastname}
                </button>
              </div>
            ) : null
          )}
        </div>

        <div>
          {secondUser && conversationId ? (
            <MessagePanel
              onlineUser={onlineUser}
              userId={userId}
              conversationId={conversationId}
              socket={socket}
              secondUser={secondUser}
            />
          ) : (
            <Initial />
          )}
        </div>
      </div>
    </div>
  );
};
