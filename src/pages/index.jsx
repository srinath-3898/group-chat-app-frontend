import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Home.module.css";
import {
  SendOutlined,
  UserOutlined,
  MoreOutlined,
  LogoutOutlined,
  LoadingOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Dropdown, Spin, Tooltip, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, getUsers } from "@/store/user/userActions";
import ProfileDrawer from "@/components/drawers/ProfileDrawer";
import { resetUserData, setUserDetails } from "@/store/user/userSlice";
import { setToken } from "@/store/auth/authSlice";
import { sendMessage } from "@/store/message/messageActions";
import { getAllMessages } from "@/store/messages/messagesActions";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { userDetails } = useSelector((state) => state.user);
  const {
    loading,
    users,
    error: usersError,
  } = useSelector((state) => state.user);
  const {
    loading: messagesLoading,
    messages,
    error: messagesError,
  } = useSelector((state) => state.messages);
  const { loading: messageLoading, error: messageError } = useSelector(
    (state) => state.message
  );

  const [open, setOpen] = useState(false);
  const [userMessage, setUserMessage] = useState({ text: "" });
  const [messageApi, contextHolder] = message.useMessage();

  const items = [
    {
      key: "1",
      label: (
        <div className={styles.item}>
          <p className="text-small">Logout</p>
          <LogoutOutlined />
        </div>
      ),
    },
  ];

  const handleSendMessage = () => {
    dispatch(sendMessage(userMessage)).then(() => {
      setUserMessage({ text: "" });
      dispatch(getAllMessages());
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
    setInterval(() => {
      dispatch(getUsers()).then((response) => {
        if (response?.payload?.data?.status) {
          dispatch(getAllMessages());
        }
      });
    }, 10000);
  }, []);

  useEffect(() => {
    if (messageError) {
      messageApi.open({
        content: messageError,
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
                onClick={() => setOpen(true)}
              />
            </Tooltip>
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <MoreOutlined style={{ fontSize: "30px", color: "#000000" }} />
            </Dropdown>
          </div>
          {loading && !users && !usersError ? (
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
          {!loading && !users && usersError ? (
            <div>
              <p>{usersError}</p>
            </div>
          ) : (
            <></>
          )}
          {!loading && users && users?.length > 0 && !usersError > 0 ? (
            <div className={styles.container_1_box_2}>
              {users?.map((user) => (
                <div key={user?.id} className={styles.user}>
                  <p className="text-small">{user?.fullName}</p>
                  <p
                    className="text-extra-small bold"
                    style={{ color: user?.loginStatus ? "#008069" : "grey" }}
                  >
                    {user?.loginStatus ? "Online" : "Offline"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className={styles.container_2}>
          <div className={styles.container_2_box_1}></div>
          <div className={styles.container_2_box_2}>
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
              <div>
                <p>{messagesError}</p>
              </div>
            ) : (
              <></>
            )}
            {!messagesLoading &&
            messages &&
            messages?.length > 0 &&
            !messagesError ? (
              messages?.map((message) => (
                <div
                  key={message?.id}
                  className={`${styles.message}  ${
                    userDetails?.id === message?.userId
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
                      <p className="text-small ">{message?.text}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          <div className={styles.container_2_box_3}>
            <input
              className={styles.message_input}
              type="text"
              placeholder="Type your message..."
              value={userMessage.text}
              onChange={(event) => setUserMessage({ text: event.target.value })}
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
      <ProfileDrawer open={open} setOpen={setOpen} />
    </>
  );
}
