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
  CheckCircleFilled,
  UserAddOutlined,
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
import { getInvitations } from "@/store/invitations/invitationsActions";
import { updateInvitation } from "@/store/invitation/invitationActions";
import { resetInvitationData } from "@/store/invitation/invitationSlice";
import { resetMessageData } from "@/store/message/messageSlice";
import AddUsersDrawer from "@/components/drawers/addUserDrawer/AddUsersDrawer";
import GroupChatDrawer from "@/components/drawers/groupChatDrawer/GroupChatDrawer";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    loading,
    userDetails,
    message: authMessage,
  } = useSelector((state) => state.user);

  const {
    loading: invitationsLoading,
    invitations,
    error: invitationsError,
  } = useSelector((state) => state.invitations);

  const {
    loading: invitationLoading,
    message: invitationMessage,
    error: invitationError,
  } = useSelector((state) => state.invitations);

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
  const [addUserDrawerOpen, setAddUserDrawerOpen] = useState(false);
  const [groupChatDrawerOpen, setGroupChatDrawerOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
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
      if (response?.payload?.data?.status) {
        localStorage.clear();
        router.push("/signin");
      }
    });
  };

  const createItems = [
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

  const chatItems = [
    {
      key: "1",
      label: (
        <div className={styles.item} onClick={() => setAddUserDrawerOpen(true)}>
          <p className="text-small">Add user </p>
          <UserAddOutlined style={{ fontSize: "20px", color: "#000000" }} />
        </div>
      ),
    },
  ];

  const handleInvitationClick = (invitation) => {
    setSelectedChat(null);
    setSelectedInvitation(invitation);
  };

  const handleInvitaionButtonClick = (status) => {
    dispatch(
      updateInvitation({
        status,
        invitationId: selectedInvitation?.id,
      })
    ).then((response) => {
      dispatch(resetInvitationData());
      if (response?.payload?.data?.status) {
        setSelectedInvitation(null);
        dispatch(getInvitations()).then((response) => {
          if (response?.payload?.data?.status) {
            dispatch(getAllChats());
          }
        });
      }
    });
  };

  const handleChatClick = (chat) => {
    setSelectedInvitation(null);
    setSelectedChat(chat);
    setPageNumber(1);
    dispatch(getChatMessages({ chatId: chat?.id, pageNumber: 1 }));
  };

  const handleSendMessage = () => {
    dispatch(sendMessage({ chatId: selectedChat?.id, userMessage })).then(
      () => {
        setUserMessage({ content: "" });
        setPageNumber(1);
        dispatch(getChatMessages({ chatId: selectedChat?.id, pageNumber: 1 }));
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
    dispatch(getInvitations());
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
    if (
      authMessage ||
      messageError ||
      authError ||
      invitationMessage ||
      invitationError
    ) {
      messageApi.open({
        content: messageError
          ? messageError
          : authError
          ? authError
          : invitationMessage
          ? invitationMessage
          : invitationError
          ? invitationError
          : authMessage,
        icon: invitationMessage ? (
          <CheckCircleFilled style={{ color: "#008069" }} />
        ) : (
          <CloseCircleFilled style={{ color: "red" }} />
        ),
      });
      dispatch(resetMessageData());
      dispatch(resetInvitationData());
      dispatch(resetUserData());
    }
  }, [messageError]);

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.container_1}>
          <div className={styles.container_1_box_1}>
            <Tooltip title="Profile">
              <UserOutlined
                style={{ fontSize: "20px", color: "#000000" }}
                onClick={() => setProfileDrawerOpen(true)}
              />
            </Tooltip>
            <MyDropdown
              items={createItems}
              buttonItem={
                <PlusCircleOutlined
                  style={{ fontSize: "20px", color: "#000000" }}
                />
              }
            />

            <MyDropdown
              items={items}
              buttonItem={
                <MoreOutlined style={{ fontSize: "20px", color: "#000000" }} />
              }
            />
          </div>
          <div className={styles.container_1_box_2}>
            {invitationsLoading && !invitations && !invitationsError ? (
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
            {!invitationsLoading &&
            invitations &&
            invitations?.length > 0 &&
            !invitationsError ? (
              <div className={styles.invitations}>
                {invitations?.map((invitation) => (
                  <div
                    key={invitation?.id}
                    className={styles.invitation}
                    onClick={() => handleInvitationClick(invitation)}
                  >
                    <div className={styles.icon}></div>
                    <p className="text-small">{invitation?.chatName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
            {!invitationLoading && !invitations && invitationError ? (
              <div>
                <p>{invitationError}</p>
              </div>
            ) : (
              <></>
            )}
            {chatsLoading && !chats && !chatsError ? (
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
            {!chatsLoading && !chats && chatsError ? (
              <div>
                <p>{chatsError}</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={styles.container_2}>
          <div className={styles.container_2_box_1}>
            {selectedChat ? (
              <div
                className={styles.selected_chat}
                onClick={() => setGroupChatDrawerOpen(true)}
              >
                <div className={styles.icon}></div>
                <p className="text-small">{selectedChat?.name}</p>
              </div>
            ) : (
              <></>
            )}
            {selectedInvitation ? (
              <div className={styles.selected_invitation}>
                <div className={styles.icon}></div>
                <p className="text-small">{selectedInvitation?.chatName}</p>
              </div>
            ) : (
              <></>
            )}
            {selectedChat &&
            selectedChat?.isGroup &&
            selectedChat?.userChat?.isAdmin ? (
              <MyDropdown
                items={chatItems}
                buttonItem={
                  <MoreOutlined
                    style={{ fontSize: "20px", color: "#000000" }}
                  />
                }
              />
            ) : (
              <></>
            )}
          </div>
          {selectedChat ? (
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
                              {new Date(
                                message?.createdAt
                              ).toLocaleTimeString()}
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
                              {new Date(
                                message?.createdAt
                              ).toLocaleTimeString()}
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
          ) : selectedInvitation ? (
            <div
              className={`${styles.container_2_box_2} ${styles.container_2_box_2_res}`}
            >
              <p className="text-small">
                You have been invited to join this group
              </p>
              <div className={styles.invitation_buttons}>
                <button
                  className="btn_secondary"
                  onClick={() => handleInvitaionButtonClick(false)}
                >
                  {invitationLoading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{ color: "#ffffff", fontSize: "16px" }}
                        />
                      }
                    />
                  ) : (
                    "Reject"
                  )}
                </button>
                <button onClick={() => handleInvitaionButtonClick(true)}>
                  {invitationLoading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{ color: "#ffffff", fontSize: "16px" }}
                        />
                      }
                    />
                  ) : (
                    "Accept"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {selectedChat ? (
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
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <ProfileDrawer open={profileDrawerOpen} setOpen={setProfileDrawerOpen} />
      <CreateNewGroupDrawer
        open={createNewGroupDrawerOpen}
        setOpen={setCreateNewGroupDrawerOpen}
      />
      <AddUsersDrawer
        open={addUserDrawerOpen}
        setOpen={setAddUserDrawerOpen}
        chat={selectedChat}
      />
      <GroupChatDrawer
        open={groupChatDrawerOpen}
        setOpen={setGroupChatDrawerOpen}
        chat={selectedChat}
      />
    </>
  );
}
