import Ably from 'ably/promises'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

const ablyAtom = atom<Ably.Realtime | null>(null)

export const useInitAbly = (clientId?: string | null) => {
  const setAbly = useSetAtom(ablyAtom)
  useEffect(() => {
    if (!clientId) {
      return
    }
    const ably = new Ably.Realtime.Promise({
      authUrl: '/api/createTokenRequest',
      clientId,
    })
    setAbly(ably)
    return () => setAbly(null)
  }, [clientId])
}

export type IChannelMessage = Ably.Types.Message

export function useChannel(
  channelName: string,
  callbackOnMessage: (msg: IChannelMessage) => void
) {
  const ably = useAtomValue(ablyAtom)
  const channel = ably?.channels.get(channelName)
  useEffect(() => {
    if (channel) {
      channel.presence.enter('hello')
      channel.subscribe((msg) => {
        callbackOnMessage(msg)
      })
    }
    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [channel, callbackOnMessage])

  return [channel, ably] as [typeof channel, typeof ably]
}
