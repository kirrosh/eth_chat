import Ably from 'ably/promises'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { union, unionBy } from 'lodash'

export const ablyAtom = atom<Ably.Realtime | null>(null)

export const useInitAbly = (clientId?: string | null) => {
  const setAbly = useSetAtom(ablyAtom)
  useEffect(() => {
    if (clientId) {
      const ably = new Ably.Realtime.Promise({
        authUrl: '/api/createTokenRequest',
        clientId,
      })
      setAbly(ably)
    }
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
  }, [channel, channelName, callbackOnMessage])

  return [channel, ably] as [typeof channel, typeof ably]
}

const membersAtom = atom<Ably.Types.PresenceMessage[]>([])

const setMembersAtom = atom<
  Ably.Types.PresenceMessage[],
  Ably.Types.PresenceMessage
>(
  (get) => get(membersAtom),
  (get, set, value: Ably.Types.PresenceMessage) => {
    const currentUsers = get(membersAtom)
    const newUsers = unionBy(currentUsers, [value], 'clientId')
    set(membersAtom, newUsers)
  }
)

export const useChannelPresence = (channelName: string) => {
  const [members, setMembers] = useAtom(setMembersAtom)
  const ably = useAtomValue(ablyAtom)

  useEffect(() => {
    const channel = ably?.channels.get(channelName)
    channel?.presence.subscribe((presence) => {
      setMembers(presence)
    })
  }, [channelName, ably])
  return members
}
