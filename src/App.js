import React from 'react';
import Header from './components/header'
import Home from './pages/home'
import Lending from './pages/lending'
import './style/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {
    WagmiConfig,
    createClient,
    chain,
    configureChains,
} from "wagmi";

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const App = () => {
    const { chains, provider, webSocketProvider } = configureChains(
        [chain.localhost],
        [
            jsonRpcProvider({
                rpc: (chain) => ({
                    http: `http://localhost:8545`,
                }),
            }),
            publicProvider(),
        ],
    )

    const client = createClient({
        autoConnect: true,
        connectors: [
            new MetaMaskConnector({ chains }),
        ],
        provider,
        webSocketProvider,
    });

    return (

        <WagmiConfig client={client}>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lending" element={<Lending />} />

                </Routes>
            </BrowserRouter>

        </WagmiConfig>

    );
}

export default App;
