import React, { useEffect, useState } from "react";
import styles from "./CreateNewGroupDrawer.module.css";
import { Drawer, Spin, message } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/store/users/usersActions";
import { createGroup } from "@/store/chat/chatActions";
import { resetChatData } from "@/store/chat/chatSlice";

const CreateNewGroupDrawer = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const { loading, users, error } = useSelector((state) => state.users);

  const {
    loading: chatLoading,
    message: chatMessage,
    error: chatError,
  } = useSelector((state) => state.chat);

  const [group, setGroup] = useState({
    name: "",
    description: "",
    userIds: [],
  });
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setGroup((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUserClick = (userId) => {
    let updatedUserIds = group.userIds;
    if (updatedUserIds.includes(userId)) {
      updatedUserIds = updatedUserIds.filter((item) => item !== userId);
    } else {
      updatedUserIds.push(userId);
    }
    setGroup((prevState) => ({ ...prevState, userIds: updatedUserIds }));
  };

  const handleCreateGroup = () => {
    dispatch(createGroup(group));
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
        title="Create New Group"
        placement="left"
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        closeIcon={<ArrowLeftOutlined style={{ color: "white" }} />}
      >
        <div className={styles.container}>
          <div className={styles.input_controller}>
            <p>Group Name</p>
            <input
              type="text"
              placeholder="Please enter group name"
              name="name"
              value={group.name}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input_controller}>
            <p>Group Description</p>
            <input
              type="text"
              placeholder="Please enter group description"
              name="description"
              value={group.description}
              onChange={handleInputChange}
            />
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
                      group?.userIds?.includes(user?.id)
                        ? styles.selected_user
                        : ""
                    }`}
                    key={user?.id}
                    onClick={() => handleUserClick(user?.id)}
                  >
                    <p>{user?.fullName}</p>
                    <CheckCircleFilled
                      style={{
                        color: group?.userIds?.includes(user?.id)
                          ? "white"
                          : "grey",
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
          <button onClick={handleCreateGroup}>
            {chatLoading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ color: "#ffffff", fontSize: "16px" }}
                  />
                }
              />
            ) : (
              "Create group"
            )}
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default CreateNewGroupDrawer;
