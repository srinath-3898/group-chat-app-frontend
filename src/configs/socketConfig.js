import io from "socket.io-client";
import { nanoid } from "nanoid";

const socket = io.connect("http://localhost:8080", {
  query: { token: localStorage.getItem("token") },
});

export default socket;
