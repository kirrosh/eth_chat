import { IChannelMessage, useChannel } from 'features/ably'
import { atom, useAtom, useSetAtom } from 'jotai'
import { atomWithReset, useResetAtom } from 'jotai/utils'
import { BackspaceIcon, XCircleIcon } from '@heroicons/react/outline'
import { authAtom } from 'features/auth'
import classNames from 'classnames'
import {
  silverPack,
  goldPack,
  platinumPack,
  useEmojiTokenBalance,
} from 'features/shop'

import { CgSpinner } from 'react-icons/cg'

const messagesAtom = atomWithReset<IChannelMessage[]>([])

const addMessagesAtom = atom<IChannelMessage[], IChannelMessage[]>(
  (get) => get(messagesAtom),
  (get, set, newMessage: IChannelMessage[]) => {
    const messages = get(messagesAtom)
    const history = messages.slice(-199)
    set(messagesAtom, [...history, ...newMessage])
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

export const Messages = () => {
  const [receivedMessages, addMessages] = useAtom(addMessagesAtom)
  const resetMessages = useResetAtom(messagesAtom)
  const addEmoji = useSetAtom(addEmojiAtom)
  const removeEmoji = useSetAtom(removeEmojiAtom)
  const [emoji, setEmoji] = useAtom(emojiAtom)
  const [auth] = useAtom(authAtom)

  const [channel, ably] = useChannel('chat-demo', addMessages, resetMessages)
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
    <div className="flex flex-col h-full gap-3">
      <ul className="flex-grow overflow-auto">
        {receivedMessages.map((item) => (
          <li key={item.id}>
            <div className="flex gap-1 my-2 text-lg">
              <div
                className={classNames(
                  'px-2 py-1 rounded text-gray-200',
                  item.clientId === auth.address && 'bg-primary text-white'
                )}
              >
                {formatEthAddress(item.clientId)} :
              </div>
              <div className="py-1">{item.data.message}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between text-2xl">
        {emoji}
        <div className="text-primary">{MAX_LENTH - emoji.length / 2} left</div>
      </div>
      <div className="flex flex-wrap justify-start gap-3">
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
              className="btn-ghost border-zinc-400"
              onClick={() => addEmoji(item)}
            >
              {item}
            </button>
          ))}
        {gold > 0 &&
          goldPack.map((item) => (
            <button
              key={item}
              className="btn-ghost border-amber-400"
              onClick={() => addEmoji(item)}
            >
              {item}
            </button>
          ))}
        {platinum > 0 &&
          platinumPack.map((item) => (
            <button
              key={item}
              className="btn-ghost border-slate-200"
              onClick={() => addEmoji(item)}
            >
              {item}
            </button>
          ))}
        {isLoading && (
          <div className="grid items-center p-2 md:p-4">
            <CgSpinner className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button className="flex-grow btn-ghost" onClick={() => removeEmoji()}>
          <BackspaceIcon className="w-6 h-6" />
        </button>
        <button className="flex-grow btn-ghost" onClick={() => setEmoji('')}>
          <XCircleIcon className="w-6 h-6" />
        </button>
        <button
          disabled={emoji.length === 0}
          className="flex-grow btn-primary"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  )
}
