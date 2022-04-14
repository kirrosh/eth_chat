import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { InjectedConnector, Provider, defaultChains } from 'wagmi'

const connectors = [
  new InjectedConnector({
    chains: defaultChains,
    options: { shimDisconnect: true },
  }),
]

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider autoConnect connectors={connectors}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
