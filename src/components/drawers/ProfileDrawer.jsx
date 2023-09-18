import { Drawer, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./ProfileDrawer.module.css";
import {
  UserOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { resetUserData } from "@/store/user/userSlice";
import { editUserDetails } from "@/store/user/userActions";

const ProfileDrawer = ({ open, setOpen }) => {
  const dispatch = useDispatch();

  const {
    loading,
    userDetails,
    message: userMessage,
    error,
  } = useSelector((state) => state.user);

  const [edit, setEdit] = useState({
    fullName: false,
    email: false,
    mobile: false,
  });
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUserDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEdit = () => {
    setEdit({ fullName: false, email: false, mobile: false });
    dispatch(editUserDetails(updatedUserDetails));
  };

  useEffect(() => {
    if (userDetails) {
      setUpdatedUserDetails({
        fullName: userDetails?.fullName,
        email: userDetails?.email,
        mobile: userDetails?.mobile,
      });
    }
  }, [userDetails]);

  useEffect(() => {
    if (userMessage || error) {
      messageApi.open({
        content: userMessage ? userMessage : error,
        icon: userMessage ? (
          <CheckCircleFilled style={{ color: "#008069" }} />
        ) : (
          <CloseCircleFilled style={{ color: "red" }} />
        ),
      });
    }
    dispatch(resetUserData());
  }, [userMessage, error]);

  return (
    <>
      {contextHolder}
      <Drawer
        title="Profile"
        placement="left"
        onClose={() => {
          setEdit({ fullName: false, email: false, mobile: false });
          setUpdatedUserDetails({
            fullName: userDetails?.fullName,
            email: userDetails?.email,
            mobile: userDetails?.mobile,
          });
          setOpen(false);
        }}
        open={open}
        closeIcon={<ArrowLeftOutlined style={{ color: "white" }} />}
      >
        <div className={styles.container}>
          <div className={styles.container_1}>
            <div className={styles.container_1_box_1}>
              <UserOutlined
                style={{
                  fontSize: "50px",
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "50%",
                }}
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
          <div className={styles.container_2}>
            <p className="text-small">Your name</p>
            <div className={styles.container_2_box_1}>
              <input
                className={edit.fullName ? styles.input_active : ""}
                type="text"
                name="fullName"
                value={updatedUserDetails?.fullName}
                onChange={handleInputChange}
                disabled={!edit.fullName}
              />
              <EditOutlined
                style={{ color: "#8696a0", fontSize: "20px" }}
                onClick={() => {
                  setEdit((prevState) => ({
                    ...prevState,
                    fullName: !edit.fullName,
                    email: false,
                    mobile: false,
                  }));
                }}
              />
            </div>
          </div>
          <div className={styles.container_2}>
            <p className="text-small">Your Email</p>
            <div className={styles.container_2_box_1}>
              <input
                className={edit.email ? styles.input_active : ""}
                type="text"
                name="email"
                value={updatedUserDetails?.email}
                onChange={handleInputChange}
                disabled={!edit.email}
              />
              <EditOutlined
                style={{ color: "#8696a0", fontSize: "20px" }}
                onClick={() => {
                  setEdit({
                    fullName: false,
                    email: !edit.email,
                    mobile: false,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.container_2}>
            <p className="text-small">Your Mobile number</p>
            <div className={styles.container_2_box_1}>
              <input
                className={edit.mobile ? styles.input_active : ""}
                type="text"
                name="mobile"
                value={updatedUserDetails?.mobile}
                onChange={handleInputChange}
                disabled={!edit.mobile}
              />
              <EditOutlined
                style={{ color: "#8696a0", fontSize: "20px" }}
                onClick={() => {
                  setEdit({
                    fullName: false,
                    email: false,
                    mobile: !edit.mobile,
                  });
                }}
              />
            </div>
          </div>
          <div className={styles.container_3}>
            <button onClick={handleEdit} disabled={loading}>
              {loading ? (
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ color: "#ffffff", fontSize: "16px" }}
                    />
                  }
                />
              ) : (
                "Edit"
              )}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ProfileDrawer;
