import { useEthers } from "@usedapp/core";
import { IChannelMessage, useChannel } from "features/ably/useChannel";
import { useState } from "react";

export const Chat = () => {
  const [receivedMessages, setMessages] = useState<IChannelMessage[]>([]);
  const { activateBrowserWallet, account } = useEthers();
  const [channel, ably] = useChannel("chat-demo", (message) => {
    // Here we're computing the state that'll be drawn into the message history
    // We do that by slicing the last 199 messages from the receivedMessages buffer

    const history = receivedMessages.slice(-199);
    setMessages([...history, message]);

    // Then finally, we take the message history, and combine it with the new message
    // This means we'll always have up to 199 message + 1 new message, stored using the
    // setMessages react useState hook
  });

  const sendMessage = () => {
    channel.publish({
      name: "chat-message",
      data: {
        account,
        message: "123",
      },
    });
  };
  return (
    <div>
      <ul>
        {receivedMessages.map((item) => (
          <li key={item.id}>
            {item.data.account}: {item.data.message}
          </li>
        ))}
      </ul>
      <button onClick={sendMessage}>Send 123</button>
    </div>
  );
};
