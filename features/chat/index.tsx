import {
  IChannelMessage,
  useChannel,
  useInitAbly,
} from 'features/ably/useChannel'
import { atom, useAtom, useSetAtom } from 'jotai'
import { BackspaceIcon, XCircleIcon } from '@heroicons/react/outline'
import { authAtom } from 'features/auth'
import { ChatLauout } from './ui/layout'
import classNames from 'classnames'
import {
  silverPack,
  goldPack,
  platinumPack,
  useEmojiTokenBalance,
} from 'features/shop'

import { CgSpinner } from 'react-icons/cg'

const messagesAtom = atom<IChannelMessage[]>([])

const addMessageAtom = atom<IChannelMessage[], IChannelMessage>(
  (get) => get(messagesAtom),
  (get, set, message: IChannelMessage) => {
    const messages = get(messagesAtom)
    const history = messages.slice(-199)
    set(messagesAtom, [...history, message])
  }
)

const emojiAtom = atom('😂😂😂')
const addEmojiAtom = atom(
  (get) => get(emojiAtom),
  (get, set, newEmoji) => {
    const current = get(emojiAtom)
    if (current.length < MAX_LENTH * 2) {
      set(emojiAtom, get(emojiAtom) + newEmoji)
    }
  }
)
const removeEmojiAtom = atom(
  (get) => get(emojiAtom),
  (get, set) => {
    set(emojiAtom, get(emojiAtom).slice(0, -2))
  }
)

const freeEmoji = ['😂', '😜', '😱', '🥲', '😎']
const MAX_LENTH = 7

const formatEthAddress = (address: string) =>
  address.slice(0, 6) + '...' + address.slice(-4)

export const Chat = () => {
  const [receivedMessages, setMessages] = useAtom(addMessageAtom)
  const addEmoji = useSetAtom(addEmojiAtom)
  const removeEmoji = useSetAtom(removeEmojiAtom)
  const [emoji, setEmoji] = useAtom(emojiAtom)
  const [auth] = useAtom(authAtom)

  const [channel, ably] = useChannel('chat-demo', setMessages)
  const silver = useEmojiTokenBalance(auth?.address, 0)
  const gold = useEmojiTokenBalance(auth?.address, 1)
  const platinum = useEmojiTokenBalance(auth?.address, 2)

  const sendMessage = async () => {
    await channel?.publish({
      name: 'chat-message',
      data: {
        account: auth?.address,
        message: emoji,
      },
    })
    setEmoji('')
  }
  const isLoading =
    Number.isNaN(silver) || Number.isNaN(gold) || Number.isNaN(platinum)
  return (
    <ChatLauout>
      <div className="h-full flex flex-col gap-3">
        <ul className="flex-grow overflow-auto">
          {receivedMessages.map((item) => (
            <li key={item.id}>
              <div className="my-2 flex gap-1 text-lg">
                <div
                  className={classNames(
                    'px-2 py-1 rounded',
                    item.clientId === auth.address && 'bg-purple-600 text-white'
                  )}
                >
                  {formatEthAddress(item.clientId)} :
                </div>
                <div className="py-1">{item.data.message}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-2xl flex justify-between">
          {emoji}
          <div className="text-purple-600">
            {MAX_LENTH - emoji.length / 2} left
          </div>
        </div>
        <div className="flex gap-3 justify-start flex-wrap">
          {freeEmoji.map((item) => (
            <button
              key={item}
              className="btn-ghost"
              onClick={() => addEmoji(item)}
            >
              {item}
            </button>
          ))}
          {silver > 0 &&
            silverPack.map((item) => (
              <button
                key={item}
                className="btn-ghost bg-zinc-100"
                onClick={() => addEmoji(item)}
              >
                {item}
              </button>
            ))}
          {gold > 0 &&
            goldPack.map((item) => (
              <button
                key={item}
                className="btn-ghost bg-amber-100"
                onClick={() => addEmoji(item)}
              >
                {item}
              </button>
            ))}
          {platinum > 0 &&
            platinumPack.map((item) => (
              <button
                key={item}
                className="btn-ghost bg-slate-200"
                onClick={() => addEmoji(item)}
              >
                {item}
              </button>
            ))}
          {isLoading && (
            <div className="p-2 md:p-4 grid items-center">
              <CgSpinner className="animate-spin w-6 h-6 text-purple-600" />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex-grow" onClick={() => removeEmoji()}>
            <BackspaceIcon className="h-6 w-6" />
          </button>
          <button className="btn-ghost flex-grow" onClick={() => setEmoji('')}>
            <XCircleIcon className="h-6 w-6" />
          </button>
          <button
            disabled={emoji.length === 0}
            className="btn-primary flex-grow"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </ChatLauout>
  )
}
