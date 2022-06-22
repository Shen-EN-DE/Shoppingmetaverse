import React from 'react';
import Header from './components/header'
import Home from './pages/home'
import Staking from './pages/staking'
import Profile from './pages/profile'

import './style/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BlockchainContextProvider from "./components/context/blockChainCtx";

const App = () => {

    return (

        <BlockchainContextProvider>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/staking" element={<Staking />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </BrowserRouter>

        </BlockchainContextProvider>

    );
}

export default App;
