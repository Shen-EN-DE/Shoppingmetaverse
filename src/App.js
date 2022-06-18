import React from 'react';
import Header from './components/header'
import Home from './pages/home'
import Lending from './pages/lending'
import './style/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { providers } from "ethers";
import { Connector, Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";

import { config } from './config';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const infuraId = '61215055bc184343a0c558fde59fa107'

const chains = [chain.hardhat, ...defaultChains];
// console.log(chains);
const defaultChain = chain.mainnet;

const App = () => {
    const connectors = ({ chainId }) => {
        const rpcUrl =
            chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
            defaultChain.rpcUrls[0];
        return [
            new InjectedConnector({ chains }),
            new WalletConnectConnector({
                chains,
                options: {
                    infuraId,
                    qrcode: true,
                },
            }),
            new WalletLinkConnector({
                chains,
                options: {
                    appName: "wagmi",
                    jsonRpcUrl: `${rpcUrl}/${infuraId}`,
                },
            }),
        ];
    };

    const isChainSupported = (chainId) =>
        chains.some((x) => x.id === chainId);

    // Set up providers
    const provider = ({ chainId, connector }) =>
        chainId == 31337
            ? new providers.JsonRpcProvider(
                connector?.chains.find((x) => x.id == 31337)?.rpcUrls[0]
            )
            : providers.getDefaultProvider(
                isChainSupported(chainId) ? chainId : defaultChain.id,
                {
                    infuraId,
                }
            );

    return (

        <Provider
            autoConnect
            connectors={connectors}
            provider={provider}
        >
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lending" element={<Lending />} />

                </Routes>
            </BrowserRouter>

        </Provider>

    );
}

export default App;
