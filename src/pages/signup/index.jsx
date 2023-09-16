import React, { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "@/store/auth/authActions";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Spin, message } from "antd";
import { resetSigninAndSignupData } from "@/store/auth/authSlice";

const Signup = () => {
  const dispatch = useDispatch();

  const {
    loading,
    message: authMessage,
    error,
  } = useSelector((state) => state.auth);

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
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
          <p className="title bold">Singup</p>
        </div>
        <div className={styles.input_controller}>
          <p className="text-small">Full Name :</p>
          <input
            type="text"
            placeholder="Please enter your full name"
            name="fullName"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.input_controller}>
          <p className="text-small">Email :</p>
          <input
            type="text"
            placeholder="Please enter your email"
            name="email"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.input_controller}>
          <p className="text-small">Mobile :</p>
          <input
            type="text"
            placeholder="Please enter your mobile number"
            name="mobile"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.input_controller}>
          <p className="text-small">Password :</p>
          <input
            type="password"
            placeholder="Please enter password"
            name="password"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.input_controller}>
          <p className="text-small">Confirm password :</p>
          <input
            type="password"
            placeholder="Please confirm your passwod"
            name="confirm_password"
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

export default Signup;
