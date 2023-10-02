import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Home = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:8080", {
      query: { token: localStorage.getItem("token") },
    });
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("joinChat", 1);
    }
  }, [socket]);

  return <div>Home</div>;
};

export default Home;
