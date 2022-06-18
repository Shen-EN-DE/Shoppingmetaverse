import React from 'react';
import Header from './components/header'
import Home from './pages/home'
import Lending from './pages/staking'
import './style/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { providers } from "ethers";
import { Connector, Provider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";

import { config } from './config';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BlockchainContextProvider from "./components/context/blockChainCtx";

const App = () => {

    return (

        <BlockchainContextProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/lending" element={<Lending />} />

                </Routes>
            </BrowserRouter>

        </BlockchainContextProvider>

    );
}

export default App;
