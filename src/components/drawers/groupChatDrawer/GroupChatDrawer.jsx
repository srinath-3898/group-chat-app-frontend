import React, { use, useEffect, useState } from "react";
import styles from "./GroupChatDrawer.module.css";
import { Drawer, Dropdown, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getChatUsers,
  makeUserAdmin,
  removeAdminAccess,
  removeUser,
} from "@/store/chat/chatActions";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
  LoadingOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { resetChatData, resetChatUsers } from "@/store/chat/chatSlice";

const GroupChatDrawer = ({ open, setOpen, chat }) => {
  const dispatch = useDispatch();

  const { userDetails } = useSelector((state) => state.user);
  const {
    loading,
    chatUsers,
    message: chatMessage,
    error,
  } = useSelector((state) => state.chat);

  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onOpenChange = (userId) => {
    setUserId(userId);
  };

  const handleMakeAdmin = () => {
    dispatch(makeUserAdmin({ chatId: chat?.id, userId })).then(() => {
      dispatch(resetChatUsers());
      dispatch(getChatUsers({ chatId: chat?.id }));
    });
  };

  const handleRemoveAdminAccess = () => {
    dispatch(removeAdminAccess({ chatId: chat?.id, userId })).then(() => {
      dispatch(resetChatUsers());
      dispatch(getChatUsers({ chatId: chat?.id }));
    });
  };

  const handleRemoveUser = () => {
    dispatch(removeUser({ chatId: chat?.id, userId })).then(() => {
      dispatch(resetChatUsers());
      dispatch(getChatUsers({ chatId: chat?.id }));
    });
  };

  const adminItems = [
    {
      key: "1",
      label: (
        <div className={styles.item} onClick={handleRemoveAdminAccess}>
          <p className="text-small">Remove admin acess</p>
        </div>
      ),
    },
  ];

  const userItems = [
    {
      key: "1",
      label: (
        <div className={styles.item} onClick={handleMakeAdmin}>
          <p className="text-small">Make admin</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className={styles.item} onClick={handleRemoveUser}>
          <p className="text-small">Remove user</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (open) {
      dispatch(getChatUsers({ chatId: chat?.id }));
    }
  }, [open]);

  useEffect(() => {
    if (chatUsers) {
      const user = chatUsers?.filter((chatUser) => {
        if (chatUser?.id === userDetails?.id) {
          return chatUser;
        }
      });
      if (user[0]?.userChat?.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [chatUsers]);

  useEffect(() => {
    if (chatMessage || error) {
      messageApi.open({
        content: chatMessage ? chatMessage : error,
        icon: chatMessage ? (
          <CheckCircleFilled style={{ color: "#008069" }} />
        ) : (
          <CloseCircleFilled style={{ color: "red" }} />
        ),
      });
      dispatch(resetChatData());
    }
  }, [chatMessage, error]);

  return (
    <>
      {contextHolder}
      <Drawer
        title="Group Info"
        placement="right"
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        closeIcon={<CloseOutlined style={{ color: "white" }} />}
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
            <p className="text-small bold">Users</p>
            {loading && !chatUsers && !error ? (
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
            {!loading && !chatUsers && error ? (
              <div>
                <p>{error}</p>
              </div>
            ) : (
              <></>
            )}
            {!loading && chatUsers && chatUsers?.length > 0 && !error ? (
              <div className={styles.users}>
                {chatUsers?.map((user) => (
                  <div className={styles.user} key={user?.id}>
                    <p className="text-small">
                      {userDetails?.id === user?.id ? "You" : user?.fullName}
                    </p>
                    {user?.userChat?.isAdmin ? (
                      <div className={styles.admin}>
                        <p className="text-extra-small">Group Admin</p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className={styles.actions}>
                      {isAdmin ? (
                        <Dropdown
                          menu={{
                            items: user?.userChat?.isAdmin
                              ? adminItems
                              : userItems,
                          }}
                          placement={"bottomRight"}
                          arrow
                          trigger={["click"]}
                          onOpenChange={() => onOpenChange(user?.id)}
                        >
                          <MoreOutlined style={{ fontSize: "16px" }} />
                        </Dropdown>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default GroupChatDrawer;
