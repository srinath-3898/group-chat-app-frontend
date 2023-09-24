import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Home.module.css";
import {
  SendOutlined,
  UserOutlined,
  MoreOutlined,
  LogoutOutlined,
  LoadingOutlined,
  CloseCircleFilled,
  PlusCircleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Spin, Tooltip, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "@/store/user/userActions";
import ProfileDrawer from "@/components/drawers/profileDrawer/ProfileDrawer";
import { resetUserData, setUserDetails } from "@/store/user/userSlice";
import { setToken } from "@/store/auth/authSlice";
import { sendMessage } from "@/store/message/messageActions";
import { getChatMessages } from "@/store/messages/messagesActions";
import { signout } from "@/store/auth/authActions";
import { getAllChats } from "@/store/chats/chatsActions";
import MyDropdown from "@/components/myDropdown/MyDropdown";
import CreateNewGroupDrawer from "@/components/drawers/createNewGroupDrawer/createNewGroupDrawer";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, userDetails } = useSelector((state) => state.user);

  const {
    loading: chatsLoading,
    chats,
    error: chatsError,
  } = useSelector((state) => state.chats);

  const {
    loading: messagesLoading,
    messages,
    error: messagesError,
  } = useSelector((state) => state.messages);

  const { loading: messageLoading, error: messageError } = useSelector(
    (state) => state.message
  );

  const { error: authError } = useSelector((state) => state.auth);

  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [createNewGroupDrawerOpen, setCreateNewGroupDrawerOpen] =
    useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userMessage, setUserMessage] = useState({ content: "" });
  const [allMessages, setAllMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();

  const myDivRef = useRef(null);
  const observer = useRef(null);
  const firstMessageElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          messages?.currentPage < messages?.lastPage
        ) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, messages]
  );

  const handleLogout = () => {
    dispatch(signout()).then((response) => {
      console.log(response);
      if (response?.payload?.data?.status) {
        localStorage.clear();
        router.push("/signin");
      }
    });
  };

  const chatItems = [
    {
      key: "1",
      label: (
        <div
          className={styles.item}
          onClick={() => setCreateNewGroupDrawerOpen(true)}
        >
          <p className="text-small">Create new group</p>
          <UsergroupAddOutlined style={{ fontSize: "20px" }} />
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <div className={styles.item} onClick={handleLogout}>
          <p className="text-small">Logout</p>
          <LogoutOutlined />
        </div>
      ),
    },
  ];

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    dispatch(getChatMessages({ chatId: chat?.id, pageNumber: 1 }));
    setPageNumber(1);
  };

  console.log(allMessages);

  const handleSendMessage = () => {
    dispatch(sendMessage({ chatId: selectedChat?.id, userMessage })).then(
      () => {
        setUserMessage({ content: "" });
        dispatch(getChatMessages({ chatId: selectedChat?.id, pageNumber: 1 }));
        setPageNumber(1);
      }
    );
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/signin");
    } else if (
      localStorage.getItem("token") &&
      !localStorage.getItem("userDetails")
    ) {
      dispatch(getUserDetails()).then((response) => {
        localStorage.setItem(
          "userDetails",
          JSON.stringify(response?.payload?.data?.data?.userDetails)
        );
      });
    } else {
      dispatch(setToken(localStorage.getItem("token")));
      dispatch(setUserDetails(JSON.parse(localStorage.getItem("userDetails"))));
    }
  }, []);

  useEffect(() => {
    dispatch(getAllChats());
  }, []);

  useEffect(() => {
    if (selectedChat && pageNumber > 1) {
      dispatch(getChatMessages({ chatId: selectedChat?.id, pageNumber }));
    }
  }, [pageNumber, selectedChat]);

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
    if (messageError || authError) {
      messageApi.open({
        content: messageError ? messageError : authError,
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
    }
    dispatch(resetUserData());
  }, [messageError]);

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.container_1}>
          <div className={styles.container_1_box_1}>
            <Tooltip title="Profile">
              <UserOutlined
                style={{ fontSize: "30px", color: "#000000" }}
                onClick={() => setProfileDrawerOpen(true)}
              />
            </Tooltip>
            <MyDropdown
              items={chatItems}
              buttonItem={
                <PlusCircleOutlined
                  style={{ fontSize: "30px", color: "#000000" }}
                />
              }
            />
            <MyDropdown
              items={items}
              buttonItem={
                <MoreOutlined style={{ fontSize: "30px", color: "#000000" }} />
              }
            />
          </div>
          <div className={styles.container_1_box_2}>
            {!chatsLoading && !chats && !chatsError ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ color: "#008069", fontSize: "16px" }}
                  />
                }
              />
            ) : (
              <></>
            )}
            {!chatsLoading && chats && chats?.length > 0 && !chatsError ? (
              <div className={styles.chats}>
                {chats?.map((chat) => (
                  <div
                    key={chat?.id}
                    className={styles.chat}
                    onClick={() => handleChatClick(chat)}
                  >
                    <div className={styles.icon}></div>
                    <p className="text-small">{chat?.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={styles.container_2}>
          <div className={styles.container_2_box_1}>
            {selectedChat ? (
              <div className={styles.selected_chat}>
                <div className={styles.icon}></div>
                <p className="text-small">{selectedChat?.name}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.container_2_box_2} ref={myDivRef}>
            {messageLoading && !messages && !messagesError ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ color: "#008069", fontSize: "16px" }}
                  />
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
                          {userDetails?.id !== message?.userId ? (
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
                          <p className="text-small ">{message?.content}</p>
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
                          {userDetails?.id !== message?.userId ? (
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
                          <p className="text-small ">{message?.content}</p>
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
          <div className={styles.container_2_box_3}>
            <input
              className={styles.message_input}
              type="text"
              placeholder="Type your message..."
              value={userMessage.content}
              onChange={(event) =>
                setUserMessage({ content: event.target.value })
              }
            />
            <div className={styles.send_button}>
              {messageLoading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ color: "#54656f", fontSize: "16px" }}
                    />
                  }
                />
              ) : (
                <SendOutlined
                  style={{
                    fontSize: "20px",
                    color: "#54656f",
                    borderRadius: "50%",
                  }}
                  onClick={handleSendMessage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <ProfileDrawer open={profileDrawerOpen} setOpen={setProfileDrawerOpen} />
      <CreateNewGroupDrawer
        open={createNewGroupDrawerOpen}
        setOpen={setCreateNewGroupDrawerOpen}
      />
    </>
  );
}
