import { useEffect, useRef, useState } from "react";
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
  UserAddOutlined,
  PaperClipOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "@/store/user/userActions";
import ProfileDrawer from "@/components/drawers/profileDrawer/ProfileDrawer";
import { setUserDetails } from "@/store/user/userSlice";
import { resetAuthData, setToken } from "@/store/auth/authSlice";
import { sendMessage } from "@/store/message/messageActions";
import { getChatMessages } from "@/store/messages/messagesActions";
import { signout } from "@/store/auth/authActions";
import { getAllChats } from "@/store/chats/chatsActions";
import MyDropdown from "@/components/myDropdown/MyDropdown";
import CreateNewGroupDrawer from "@/components/drawers/createNewGroupDrawer/createNewGroupDrawer";
import { getInvitations } from "@/store/invitations/invitationsActions";
import { resetMessageData } from "@/store/message/messageSlice";
import AddUsersDrawer from "@/components/drawers/addUserDrawer/AddUsersDrawer";
import GroupChatDrawer from "@/components/drawers/groupChatDrawer/GroupChatDrawer";
import Chat from "@/components/chat/Chat";
import useSocketHook from "@/customHooks/useSocketHook";
import Invitation from "@/components/invitation/Invitation";
import { resetMessagesData } from "@/store/messages/messagesSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const socket = useSocketHook();

  const { userDetails } = useSelector((state) => state.user);

  const {
    loading: invitationsLoading,
    invitations,
    error: invitationsError,
  } = useSelector((state) => state.invitations);

  const {
    loading: chatsLoading,
    chats,
    error: chatsError,
  } = useSelector((state) => state.chats);

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
  const [userMessage, setUserMessage] = useState({
    content: "",
    type: "text",
    file: null,
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();

  const fileInputRef = useRef(null);

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
          <p className="text-small">New Chat</p>
          <MessageOutlined style={{ fontSize: "20px" }} />
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          className={styles.item}
          onClick={() => setCreateNewGroupDrawerOpen(true)}
        >
          <p className="text-small">New group</p>
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

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setSelectedInvitation(null);
    setPageNumber(1);
  };

  const handleFileInputChange = (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      setUserMessage((prevState) => ({
        ...prevState,
        content: file.name,
        type: getFileType(file),
        file: file,
      }));
    }
  };

  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    return "document";
  };

  const handleSendMessage = () => {
    let messagePayload = {
      chatId: selectedChat?.id,
      userMessage,
    };
    if (userMessage.type !== "text" && userMessage.file) {
      const formData = new FormData();
      formData.append("file", userMessage.file);
      messagePayload.fileData = formData;
    }
    dispatch(sendMessage(messagePayload)).then(() => {
      setUserMessage({ content: "", type: "text", file: null });
      setPageNumber(1);
      dispatch(getChatMessages({ chatId: selectedChat?.id, pageNumber: 1 }));
    });
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
    dispatch(getAllChats());
  }, []);

  useEffect(() => {
    if (selectedChat) {
      dispatch(resetMessagesData());
      socket.emit("joinChat", selectedChat?.id);
      dispatch(getChatMessages({ chatId: selectedChat?.id, pageNumber: 1 }));
    }
  }, [selectedChat]);

  useEffect(() => {
    if (messageError || authError) {
      messageApi.open({
        content: messageError ? messageError : authError,
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
      dispatch(resetAuthData());
      dispatch(resetMessageData());
    }
  }, [, messageError, authError]);

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.container_1}>
          <div className={styles.container_1_box_1}>
            {userDetails?.profilePic ? (
              <img
                src={userDetails?.profilePic}
                className={styles.profile_pic}
                alt=""
                onClick={() => setProfileDrawerOpen(true)}
              />
            ) : (
              <UserOutlined
                style={{ fontSize: "25px", color: "#000000" }}
                onClick={() => setProfileDrawerOpen(true)}
              />
            )}
            <div>
              <MyDropdown
                items={createItems}
                buttonItem={
                  <PlusCircleOutlined
                    style={{ fontSize: "25px", color: "#000000" }}
                  />
                }
              />
            </div>

            <MyDropdown
              items={items}
              buttonItem={
                <MoreOutlined style={{ fontSize: "25px", color: "#000000" }} />
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
            {!invitationsLoading && !invitations && invitationsError ? (
              <div>
                <p>{invitationsError}</p>
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
          <div className={styles.container_2_box_2}>
            {selectedChat ? (
              <Chat
                chat={selectedChat}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            ) : (
              <></>
            )}
            {selectedInvitation ? (
              <Invitation
                invitation={selectedInvitation}
                setInvitation={setSelectedInvitation}
              />
            ) : (
              <></>
            )}
          </div>
          {selectedChat ? (
            <div className={styles.container_2_box_3}>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              <div className={styles.paper_clip_outlined}>
                <PaperClipOutlined
                  style={{
                    fontSize: "20px",
                    color: "#54656f",
                    borderRadius: "50%",
                  }}
                  onClick={() => fileInputRef.current.click()}
                />
              </div>
              <input
                className={styles.message_input}
                type="text"
                placeholder="Type your message..."
                value={userMessage.content}
                onChange={(event) =>
                  setUserMessage((prevState) => ({
                    ...prevState,
                    content: event.target.value,
                  }))
                }
                onKeyDown={(event) => {
                  console.log("hello");
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
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
