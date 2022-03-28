import { formatEther } from "@ethersproject/units";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { Chat } from "features/chat";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);
  return (
    <div className={styles.container}>
      <Head>
        <title>Ethereum Chat</title>
        <meta name="description" content="Ethereum Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          {!account && (
            <button onClick={() => activateBrowserWallet()}>Connect</button>
          )}
          {account && <Chat />}
          {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
        </div>
      </main>
    </div>
  );
};

export default Home;
