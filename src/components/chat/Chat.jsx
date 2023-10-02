import { getChatMessages } from "@/store/messages/messagesActions";
import { LoadingOutlined } from "@ant-design/icons";
import { Image, Spin } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Chat.module.css";
import useSocketHook from "@/customHooks/useSocketHook";
import { resetMessagesData } from "@/store/messages/messagesSlice";

const Chat = ({ chat, pageNumber, setPageNumber }) => {
  const dispatch = useDispatch();

  const socket = useSocketHook();

  const { userDetails } = useSelector((state) => state.user);

  const {
    loading: messagesLoading,
    messages,
    error: messagesError,
  } = useSelector((state) => state.messages);

  console.log(messages);

  const [allMessages, setAllMessages] = useState([]);

  const myDivRef = useRef(null);
  const observer = useRef(null);

  const firstMessageElementRef = useCallback(
    (node) => {
      if (messagesLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          messages?.currentPage < messages?.lastPage
        ) {
          dispatch(resetMessagesData());
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [messagesLoading, messages]
  );

  useEffect(() => {
    if (messages && messages?.currentPage === 1) {
      setAllMessages(messages?.data);
    } else if (messages && messages?.currentPage > 1) {
      setAllMessages((prevState) => [...messages?.data, ...prevState]);
    }
  }, [messages]);

  useEffect(() => {
    if (myDivRef.current && messages?.currentPage === 1) {
      myDivRef.current.scrollTop = myDivRef.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    if (chat && pageNumber > 1) {
      dispatch(getChatMessages({ chatId: chat?.id, pageNumber }));
    }
  }, [pageNumber, chat]);

  const onMessageReceived = (message) => {
    if (message?.chatId === chat?.id) {
      dispatch(getChatMessages({ chatId: chat?.id, pageNumber: 1 }));
    }
  };

  useEffect(() => {
    if (socket && chat) {
      socket.on("messageReceived", onMessageReceived);
      return () => {
        socket.off("messageReceived", onMessageReceived);
      };
    }
    return;
  }, [socket, chat]);

  return (
    <div className={styles.container_2_box_2} ref={myDivRef}>
      {messagesLoading && !messages && !messagesError ? (
        <Spin
          indicator={
            <LoadingOutlined style={{ color: "#008069", fontSize: "16px" }} />
          }
        />
      ) : (
        <></>
      )}
      {!messagesLoading && !messages && messagesError ? (
        <div className={styles.error}>
          <p className="text-small">{messagesError}</p>
        </div>
      ) : (
        <></>
      )}
      {!messagesError ? (
        allMessages.map((message, index) => {
          if (index === 0) {
            return (
              <div
                key={message?.id}
                className={`${styles.message}  ${
                  userDetails?.id === message?.senderId
                    ? styles.message_right
                    : ""
                }`}
                ref={firstMessageElementRef}
              >
                <div className={styles.message_content}>
                  <div className={styles.message_content_header}>
                    {userDetails?.id !== message?.senderId ? (
                      <p className="text-extra-small bold">
                        {message?.senderName}
                      </p>
                    ) : (
                      <p className="text-extra-small bold">You</p>
                    )}
                    <p className="text-extra-small">
                      {new Date(message?.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className={styles.message_content_body}>
                    {message?.type === "text" ? (
                      <p className="text-small ">{message?.content}</p>
                    ) : (
                      <Image
                        width={"100%"}
                        height={"auto"}
                        alt=""
                        src={message?.url}
                        loading={messagesLoading}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={message?.id}
                className={`${styles.message}  ${
                  userDetails?.id === message?.senderId
                    ? styles.message_right
                    : ""
                }`}
              >
                <div className={styles.message_content}>
                  <div className={styles.message_content_header}>
                    {userDetails?.id !== message?.senderId ? (
                      <p className="text-extra-small bold">
                        {message?.senderName}
                      </p>
                    ) : (
                      <p className="text-extra-small bold">You</p>
                    )}
                    <p className="text-extra-small">
                      {new Date(message?.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className={styles.message_content_body}>
                    {message?.type === "text" ? (
                      <p className="text-small ">{message?.content}</p>
                    ) : (
                      <Image
                        width={"100%"}
                        height={"auto"}
                        alt=""
                        src={message?.url}
                        loading={messagesLoading}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chat;
