import { useInitAbly } from 'features/ably'
import { useInitAuth, useMetamaskAuth } from 'features/auth'
import { Chat } from 'features/chat'
import { ShopOverlay } from 'features/shop'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { CgSpinner } from 'react-icons/cg'

const Home: NextPage = () => {
  const [{ address, error, loading }, signIn, signOut] = useMetamaskAuth()
  useInitAuth()
  useInitAbly(address)
  return (
    <div className="w-screen h-screen px-2 py-1">
      <Head>
        <title>Ethereum Chat</title>
        <meta name="description" content="Ethereum Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full h-full">
        {loading ? (
          <div className="grid w-full h-full place-items-center">
            <CgSpinner className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {!address && (
              <div className="grid w-full h-full gap-4 place-content-center">
                <Image
                  src="/metamask.svg"
                  height={100}
                  width={100}
                  alt="metamask"
                />
                <button className="btn-primary" onClick={signIn}>
                  Connect
                </button>
              </div>
            )}
            {address && <Chat />}
            {address && <ShopOverlay />}
          </>
        )}
      </main>
    </div>
  )
}

export default Home
