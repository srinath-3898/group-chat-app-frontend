import React, { useEffect, useState } from "react";
import styles from "./AddUsersDrawer.module.css";
import { Drawer, Spin, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/store/users/usersActions";
import { addUsers } from "@/store/chat/chatActions";
import { resetChatData } from "@/store/chat/chatSlice";

const AddUsersDrawer = ({ open, setOpen, chat }) => {
  const dispatch = useDispatch();

  const { loading, users, error } = useSelector((state) => state.users);
  const {
    loading: chatLoading,
    message: chatMessage,
    error: chatError,
  } = useSelector((state) => state.chat);

  const [userIds, setUserIds] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const handleUserClick = (userId) => {
    let updatedUserIds = userIds;
    if (updatedUserIds.includes(userId)) {
      updatedUserIds = updatedUserIds.filter((item) => item !== userId);
    } else {
      updatedUserIds.push(userId);
    }
    setUserIds([...updatedUserIds]);
  };

  const handleAddUsers = () => {
    dispatch(addUsers({ chatId: chat?.id, userIds }));
  };

  useEffect(() => {
    if (open) {
      dispatch(getAllUsers(1));
    }
  }, [open]);

  useEffect(() => {
    if (chatMessage || chatError) {
      messageApi.open({
        content: chatMessage ? chatMessage : chatError,
        icon: chatMessage ? (
          <CheckCircleFilled style={{ color: "#008069" }} />
        ) : (
          <CloseCircleFilled style={{ color: "red" }} />
        ),
      });
      dispatch(resetChatData());
    }
  }, [chatMessage, chatError]);

  return (
    <>
      {contextHolder}
      <Drawer
        title="Add users"
        placement="left"
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        closeIcon={<ArrowLeftOutlined style={{ color: "white" }} />}
      >
        <div className={styles.container}>
          <div className={styles.container_1}>
            <p className="text-small bold">Group Name</p>
            <p className="text-small ">{chat?.name}</p>
          </div>
          <div className={styles.container_1}>
            <p className="text-small bold">Group Description</p>
            <p className="text-small ">{chat?.description}</p>
          </div>
          <div className={styles.add_users}>
            <p>Please select the users you want to add to this group</p>
            {loading && !users && !error ? (
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
            {!loading && !users && error ? (
              <div>
                <p>{error}</p>
              </div>
            ) : (
              <></>
            )}
            {!loading && users && users?.length > 0 && !error ? (
              <div className={styles.users}>
                {users?.map((user) => (
                  <div
                    className={`${styles.user} ${
                      userIds?.includes(user?.id) ? styles.selected_user : ""
                    }`}
                    key={user?.id}
                    onClick={() => handleUserClick(user?.id)}
                  >
                    <p>{user?.fullName}</p>
                    <CheckCircleFilled
                      style={{
                        color: userIds?.includes(user?.id) ? "white" : "grey",
                        fontSize: "16px",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <button onClick={handleAddUsers}>
            {" "}
            {chatLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ color: "#ffffff", fontSize: "16px" }}
                  />
                }
              />
            ) : (
              "Add"
            )}
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default AddUsersDrawer;
