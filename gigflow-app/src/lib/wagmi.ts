import { createConfig, configureChains } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

const { chains, publicClient } = configureChains(
  [avalancheFuji],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient
});

export { chains };
