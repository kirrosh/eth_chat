import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect } from 'wagmi'

export const ironOptions = {
  cookieName: process.env.IRON_SESSION_COOKIE_NAME || 'siwe',
  password: process.env.IRON_SESSION_PASSWORD || '',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

export const authAtom = atom<{
  address?: string
  chainId?: number
  error?: Error
  loading?: boolean
}>({ loading: true })

export const useMetamaskAuth = () => {
  const [{ data, error }, connect] = useConnect()
  const [account] = useAccount()
  const [auth, setAuth] = useAtom(authAtom)

  const signIn = useCallback(async () => {
    const connector = data.connectors[0]
    try {
      setAuth((x) => ({ ...x, error: undefined, loading: true }))
      const res = await connect(connector) // connect from useConnect
      if (!res.data) throw res.error ?? new Error('Something went wrong')
      const address = res.data.account
      const chainId = res.data.chain?.id
      const nonceRes = await fetch('/api/auth/nonce')
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '2',
        chainId: res.data.chain?.id,
        nonce: await nonceRes.text(),
      })

      const signer = await connector.getSigner()
      const signature = await signer.signMessage(message.prepareMessage())

      const verifyRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')

      setAuth((x) => ({ ...x, address, loading: false, chainId }))
    } catch (error: any) {
      console.log(error)
      setAuth({ error, loading: false })
    }
  }, [])

  const signOut = useCallback(async () => {
    await fetch('/api/auth/logout')
    setAuth({})
  }, [])

  useEffect(() => {
    if (
      account.data?.address &&
      auth.address &&
      account.data?.address !== auth.address
    ) {
      signOut()
    }
  }, [account.data?.address, auth.address])

  return [auth, signIn, signOut] as [typeof auth, typeof signIn, typeof signOut]
}

export const useInitAuth = () => {
  const [auth, setAuth] = useAtom(authAtom)
  const handler = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const json = await res.json()
      setAuth((x) => ({ ...x, address: json.address }))
    } finally {
      setAuth((x) => ({ ...x, loading: false }))
    }
  }, [])
  useEffect(() => {
    ;(async () => await handler())()
  }, [auth.address])

  useEffect(() => {
    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])
}
