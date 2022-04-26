# ETH Chat

Full-Stack Next.js 😄 chat app connected to Ethereum blockchain (Ropsten network).

Core features:

- Modern frontend ([Next.js](https://nextjs.org/), [Tailwind](https://tailwindcss.com/), [Jotai](https://jotai.org/), [Typescript](https://www.typescriptlang.org/))
- Autorisation with Metamask ([Siwe](https://github.com/spruceid/siwe), [Iron-session](https://github.com/vvo/iron-session))
- Emoji shop ([Wagmi](https://wagmi.sh/))
- Ethereum smart contracts ([Hardhat](https://hardhat.org/), [Openzeppelin](https://openzeppelin.com/))
- Realtime chat ([Ably](https://ably.com/))

## Web APP

.env

```
ABLY_API_KEY=
IRON_SESSION_PASSWORD=
```

Standard Next.js commands for dev/build (https://nextjs.org/docs/getting-started)

```
npm run dev
npm run build
```

Smart contracts are placed in `/ethereum` folder.

Deploy all contracts and add listings:

```
npx hardhat run --network ropsten scripts/deploy.ts
```

`/ethereum/address/emoji` should be manually updated after deploy.

Also files (`/ethereum/artifacts/contracts/[name].sol/[name].json`) should be copied to `/artifacts`.

Add listings after deploy:

```
npx hardhat run --network ropsten scripts/addListings.ts
```
