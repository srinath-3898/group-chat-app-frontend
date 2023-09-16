import React from "react";
import styles from "./Signup.module.css";

const Signup = () => {
  return (
    <div className={styles.container}>
      <div className={styles.container_1}>
        <p className="title bold">Singup</p>
      </div>
      <div className={styles.input_controller}>
        <p className="text-small">Full Name :</p>
        <input type="text" placeholder="Please enter your full name" />
      </div>
      <div className={styles.input_controller}>
        <p className="text-small">Email :</p>
        <input type="text" placeholder="Please enter your email" />
      </div>
      <div className={styles.input_controller}>
        <p className="text-small">Mobile :</p>
        <input type="text" placeholder="Please enter your mobile number" />
      </div>
      <div className={styles.input_controller}>
        <p className="text-small">Password :</p>
        <input type="text" placeholder="Please enter password" />
      </div>
      <div className={styles.input_controller}>
        <p className="text-small">Confirm password :</p>
        <input type="text" placeholder="Please confirm your passwod" />
      </div>
      <div className={styles.container_2}>
        <button>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
