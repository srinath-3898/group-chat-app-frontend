import { Drawer, Image, Spin, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import styles from "./ProfileDrawer.module.css";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { resetUserData } from "@/store/user/userSlice";
import {
  editUserDetails,
  uploadProfilePicture,
} from "@/store/user/userActions";

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
  const [profilePic, setProfilePic] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fileInputRef = useRef(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedUserDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEdit = () => {
    setEdit({ fullName: false, email: false, mobile: false });
    dispatch(editUserDetails(updatedUserDetails)).then((response) => {
      localStorage.setItem(
        "userDetails",
        JSON.stringify(response?.payload?.data?.data?.userDetails)
      );
    });
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleUploadProfilePicture = () => {
    const formData = new FormData();
    formData.append("file", profilePic);
    dispatch(uploadProfilePicture(formData)).then((response) => {
      localStorage.setItem(
        "userDetails",
        JSON.stringify(response?.payload?.data?.data?.userDetails)
      );
      setProfilePic(null);
    });
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

  console.log(userDetails);

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
              <Image
                style={{ borderRadius: "50%" }}
                width={100}
                height={100}
                src={userDetails?.profilePic}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
              />
            </div>
            <div className={styles.container_1_box_2}>
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileInputChange}
              />
              <button
                className="btn_secondary"
                onClick={
                  profilePic
                    ? handleUploadProfilePicture
                    : () => fileInputRef.current.click()
                }
              >
                {profilePic
                  ? "Upload"
                  : userDetails?.profilePic
                  ? "Change profile pic"
                  : "Add profile pic"}
              </button>
            </div>
          </div>
          <img src={profilePic} alt="" />
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
