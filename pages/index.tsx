import { useMetamaskAuth } from 'features/auth'
import { Chat } from 'features/chat'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  const [{ address, error, loading }, signIn, signOut] = useMetamaskAuth()
  return (
    <div className="px-2 py-1 h-screen w-screen">
      <Head>
        <title>Ethereum Chat</title>
        <meta name="description" content="Ethereum Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full">
        {!address && (
          <div className="h-full w-full grid place-content-center gap-4">
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
      </main>
    </div>
  )
}

export default Home
