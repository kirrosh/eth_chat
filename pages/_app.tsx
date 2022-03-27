import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  Mainnet,
  DAppProvider,
  useEtherBalance,
  useEthers,
  Config,
} from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]:
      "https://mainnet.infura.io/v3/57fc2c19095745e59ab96a4aa87dada8",
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  );
}

export default MyApp;
