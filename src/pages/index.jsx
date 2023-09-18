import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./Home.module.css";
import {
  SendOutlined,
  UserOutlined,
  MoreOutlined,
  LogoutOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Dropdown, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, getUsers } from "@/store/user/userActions";
import ProfileDrawer from "@/components/drawers/ProfileDrawer";
import { setUserDetails } from "@/store/user/userSlice";
import { setToken } from "@/store/auth/authSlice";
import { sendMessage } from "@/store/message/messageActions";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, users, error } = useSelector((state) => state.user);
  const { loading: mesageLoading, error: messageError } = useSelector(
    (state) => state.message
  );

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({ text: "" });

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
    dispatch(sendMessage(message));
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
    dispatch(getUsers());
  }, []);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_1}>
          <div className={styles.container_1_box_1}>
            <Tooltip title="Profile">
              <UserOutlined
                style={{ fontSize: "30px", color: "whitesmoke" }}
                onClick={() => setOpen(true)}
              />
            </Tooltip>
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <MoreOutlined style={{ fontSize: "30px", color: "whitesmoke" }} />
            </Dropdown>
          </div>
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
          {!loading && users && users?.length && !error > 0 ? (
            <div className={styles.container_1_box_2}>
              {users?.map((user) => (
                <div key={user?.id} className={styles.user}>
                  <p className="text-small">{user?.fullName}</p>
                  <p className="text-extra-small">
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
          <div className={styles.container_2_box_2}></div>
          <div className={styles.container_2_box_3}>
            <input
              className={styles.message_input}
              type="text"
              placeholder="Type your message..."
              value={message.text}
              onChange={(event) => setMessage({ text: event.target.value })}
            />
            <div className={styles.send_button}>
              <SendOutlined
                style={{
                  fontSize: "20px",
                  color: "#54656f",
                  borderRadius: "50%",
                }}
                onClick={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
      <ProfileDrawer open={open} setOpen={setOpen} />
    </>
  );
}
