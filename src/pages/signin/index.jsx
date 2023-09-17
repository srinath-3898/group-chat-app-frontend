import React, { useEffect, useState } from "react";
import styles from "./Signin.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Spin, message } from "antd";
import { CloseCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { resetSigninAndSignupData } from "@/store/auth/authSlice";
import Link from "next/link";
import { signin } from "@/store/auth/authActions";
import { useRouter } from "next/router";

const Signin = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error } = useSelector((state) => state.auth);

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
    dispatch(signin(userDetails)).then((response) => {
      console.log(response);
      if (response?.payload?.data?.status) {
        router.push("/");
      }
    });
  };

  useEffect(() => {
    if (error) {
      messageApi.open({
        key: "updatable",
        content: error,
        icon: <CloseCircleFilled style={{ color: "red" }} />,
      });
    }
    dispatch(resetSigninAndSignupData());
  }, [error]);

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
            type="password"
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
              "Signin"
            )}
          </button>
        </div>
        <div className={styles.container_3}>
          <p className="text-small">
            {`Don't`} have an account? Please{" "}
            <span>
              <Link href={"/signup"}>Singup</Link>
            </span>{" "}
            here
          </p>
        </div>
      </div>
    </>
  );
};

export default Signin;
