import React, { useEffect, useState } from "react";
import styles from "./Signin.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Spin, message } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { resetSigninAndSignupData } from "@/store/auth/authSlice";

const Signin = () => {
  const dispatch = useDispatch();

  const {
    loading,
    message: authMessage,
    error,
  } = useSelector((state) => state.auth);

  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSignup = () => {
    dispatch(signup(userDetails));
  };

  useEffect(() => {
    if (authMessage || error) {
      messageApi.open({
        content: authMessage ? authMessage : error,
        icon: authMessage ? (
          <CheckCircleFilled style={{ color: "#00a300" }} />
        ) : (
          <CloseCircleFilled style={{ color: "red" }} />
        ),
      });
    }
    dispatch(resetSigninAndSignupData());
  }, [authMessage, error]);

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.container_1}>
          <p className="title bold">Signin</p>
        </div>
        <div className={styles.input_controller}>
          <p className="text-small">Email :</p>
          <input
            type="text"
            placeholder="Please enter your registered email"
            name="email"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.input_controller}>
          <p className="text-small">Password :</p>
          <input
            type="text"
            placeholder="Please enter your password"
            name="password"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.container_2}>
          <button onClick={handleSignup} disabled={loading}>
            {loading ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ color: "#ffffff", fontSize: "16px" }}
                  />
                }
              />
            ) : (
              "Signup"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Signin;
