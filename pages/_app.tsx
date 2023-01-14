import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import Layout from '../components/Layout';
import { SessionProvider } from 'next-auth/react';
import { UIProvider } from '../contexts/UIContext';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { polygonMumbai } from 'wagmi/chains';
import { Toaster } from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';
import { RoomProvider } from '../contexts/RoomContext';
import { ChatProvider } from '../contexts/ChatContext';

const { chains, provider } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => {
        return {
          http: 'https://rpc.ankr.com/polygon_mumbai',
        };
      },
    }),
    publicProvider(),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={session}>
        <ChatProvider>
          <RoomProvider>
            <UIProvider>
              <Layout>
                <Toaster position="top-center" reverseOrder={false} />
                <ConfirmationModal />
                <Component {...pageProps} />
              </Layout>
            </UIProvider>
          </RoomProvider>
        </ChatProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
