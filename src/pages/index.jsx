import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./Home.module.css";
import { SendOutlined } from "@ant-design/icons";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/signin");
    }
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.container_1}></div>
      <div className={styles.container_2}>
        <div className={styles.container_2_box_1}></div>
        <div className={styles.container_2_box_2}></div>
        <div className={styles.container_2_box_3}>
          <input
            className={styles.message_input}
            type="text"
            placeholder="Type tour message"
          />
          <div className={styles.send_button}>
            <SendOutlined
              style={{
                fontSize: "20px",
                color: "#54656f",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
