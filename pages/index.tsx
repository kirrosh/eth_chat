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
    <div className="px-2 py-1 h-screen w-screen">
      <Head>
        <title>Ethereum Chat</title>
        <meta name="description" content="Ethereum Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full">
        {!account && (
          <div className="h-full w-full grid place-content-center gap-4">
            <Image
              src="/metamask.svg"
              height={100}
              width={100}
              alt="metamask"
            />
            <button
              className="btn-primary"
              onClick={() => activateBrowserWallet()}
            >
              Connect
            </button>
          </div>
        )}
        {account && <Chat />}
        {/* {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>} */}
      </main>
    </div>
  );
};

export default Home;
