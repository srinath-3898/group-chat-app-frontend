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
import { resetAuthData } from "@/store/auth/authSlice";
import Link from "next/link";

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
    confirmPassword: "",
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
          <CheckCircleFilled style={{ color: "#008069" }} />
        ) : (
          <CloseCircleFilled style={{ color: "red" }} />
        ),
      });
    }
    dispatch(resetAuthData());
  }, [authMessage, error]);

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <div className={styles.container_1}>
          <p className="title bold">Sign up</p>
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
            name="confirmPassword"
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
        <div className={styles.container_3}>
          <p className="text-small">
            Already have an account? Please{" "}
            <span>
              <Link href={"/signin"}>Singin</Link>
            </span>{" "}
            to continue
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
