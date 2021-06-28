import Head from "next/head";
import Image from "next/image";
import { useSocket } from "../context/socket.context";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { socket } = useSocket();
  return (
    <div>
      <h1>{socket.id}</h1>
    </div>
  );
}
