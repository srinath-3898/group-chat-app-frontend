import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocketHook = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io("http://localhost:8080", {
      auth: { token: localStorage.getItem("token") },
    });
    setSocket(socket);
  }, []);
  return socket;
};

export default useSocketHook;
