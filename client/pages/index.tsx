import { useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSocket } from "../context/socket.context";
import styles from "../styles/Home.module.css";

import Rooms from "../components/Rooms";
import Messages from "../components/Messages";

export default function Home() {
  const { socket, username, setUsername } = useSocket();
  const usernameRef = useRef(null);

  const handleSetUSername = () => {
    const value = usernameRef.current.value;
    if (!value) return;
    setUsername(value);

    localStorage.setItem("username", value);
  };

  return (
    <div>
      {!username && (
        <div className={styles.usernameWrapper}>
          <div className="usernameInner">
            <input type="text" placeholder="Username" ref={usernameRef} />
            <button onClick={handleSetUSername}>START</button>
          </div>
        </div>
      )}

      {username && (
        <div className={styles.container}>
          <Rooms />
          <Messages />
        </div>
      )}
    </div>
  );
}
