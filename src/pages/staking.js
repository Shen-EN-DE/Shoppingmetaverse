import React, { useEffect, useContext, useState } from 'react'
import moment from "moment";
import { config } from '../config'
import { BlockchainContext } from "../components/context/blockChainCtx";
import { ethers } from 'ethers';

import { DropdownButton, Dropdown, Col, Row, Container, Table } from 'react-bootstrap'

import gold from '../style/images/gs.png'
import silver from '../style/images/ss.png'
import bronze from '../style/images/cs.png'

const SssssmokinFinance = require('../solidity/artifacts/contracts/SssssmokinFinance.sol/SssssmokinFinance.json')
const LEVELS = require('../solidity/artifacts/contracts/ShrimpNFT.sol/ShrimpNFT.json')
const SP = require('../solidity/artifacts/contracts/ShrimpToken.sol/ShrimpToken.json')

const LEVELS_ABI = LEVELS.abi
const LEVELS_ADDRESS = '0x4B1Da04F722a53DC559C62B05f79ce009b5F7b7d'

const SERVICE_ABI = SssssmokinFinance.abi
const SERVICE_ADDRESS = '0xd1BdC856bA66B325B9470543dbBbcd4EAED5008F'

const SP_ABI = SP.abi
const SP_ADDRESS = '0x665a60A503BED84b3eeb2104846f528d3a5e1BBE'
// 
// mint shrimptoken
// call getNFT
const benefitsIdxToLevel = {
    0: 'Copper',
    1: 'Silver',
    2: 'Golden',
}

const levelToBenefitsIdx = {
    Copper: 0,
    Silver: 1,
    Golden: 2
}

const levelToImg = {
    Copper: bronze,
    Silver: silver,
    Golden: gold
}

const Staking = () => {

    const { currentAccount, provider, networkId, chainId } = useContext(BlockchainContext);
    const [contract, setContract] = useState();
    const [benefits, setBenefits] = useState([])
    const [priceList, setPriceList] = useState({})
    const [lvContract, setLvContract] = useState([])
    const [userData, setUserData] = useState({
        userLevel: "Copper"
    })
    const [selCurrency, setCurrency] = useState()
    const [stakeAmount, setAmount] = useState()

    const [credit, setCredit] = useState(5000000)

    const [loan, setLoan] = useState([{
        apr: 0.09,
        date: '2022-06-20T23:24:23+08:00',
        eth: 0.00004379294,
        stake: 5000000
    }])

    // TODO 借貸會先檢查會員等級, 所以必須先有等級
    const onDeposit = async () => {

        // 呼叫getnft
        try {

            await lvContract.GetNFT()
            // 使用的蝦幣金額
            // console.log(stakeAmount)
            // const res = await contract.depositETH(stakeAmount);
            setTimeout(() => {
                setLoan(prev => {
                    return [...prev, {
                        apr: 0.09,
                        date: '2022-06-20T23:25:45+08:00',
                        eth: 0.00004427152,
                        stake: 5000000
                    }]

                })

                setCredit(0)
            }, 3000)

        } catch (err) {
            console.error(err)
        }

    }

    const getAllBenefits = async () => {

        try {
            const _allBenefits = await contract.getAllBenefits();
            setBenefits(_allBenefits);
        } catch (error) {
            console.log(error)
        }

    }

    const checkLevel = async () => {
        try {
            const res = await lvContract.InquireUserNFT(currentAccount)
            setUserData(prev => ({
                ...prev,
                userLevel: res
            }))

        } catch (error) {
            console.error(error)
        }

    }

    const setLevels = async () => {

        await contract.setBenefits(
            0,
            config.memberBenefits.Copper
        );
        await contract.setBenefits(
            1,
            config.memberBenefits.Silver
        );
        await contract.setBenefits(
            2,
            config.memberBenefits.Golden
        );
        await contract.setTokenIdOrder(
            [0, 1, 2]
        );

    }

    const setTokens = async () => {
        await contract.setProvideTokens(config.supportedToken[0].tokenAddr, config.chainLink[0])
        await contract.setProvideTokens(config.supportedToken[1].tokenAddr, config.chainLink[1])
        await contract.setProvideTokens(config.supportedToken[2].tokenAddr, config.chainLink[2])
    }

    const getAllProvideTokens = async () => {
        const b = await contract.getAllProvideTokens()
        // console.log(b)
    }

    const getETHFeed = async () => {
        const ETH = await contract.getETHFeed()
        setPriceList(prev => ({
            ...prev,
            ETH
        }))
    }

    const getTokenFeed = () => {
        config.supportedToken.some(el => {
            if (!el.tokenAddr.length) return true
            contract.getTokenFeed(el.tokenAddr).then(res => setPriceList(prev => ({
                ...prev,
                [el.symbol]: res
            }))).catch(error => console.error(error))
        }
        )
    }

    const getUserBenefits = async () => {
        try {
            const userb = await contract.getUserBenefits(currentAccount)
            setUserData(prev => ({
                ...prev,
                userBenefits: userb
            }))
            // console.log(userb)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (provider) {
            const signer = provider.getSigner();
            provider.getBlock().then(block => {
                const a = new ethers.Contract(SERVICE_ADDRESS, SERVICE_ABI, provider, {
                    gasLimit: block.gasLimit
                });

                setContract(a.connect(signer));
                const b = new ethers.Contract(LEVELS_ADDRESS, LEVELS_ABI, provider, {
                    gasLimit: block.gasLimit
                });
                setLvContract(b.connect(signer));
            }).catch(err => console.error(err))
        }
    }, [provider]);

    useEffect(() => {

        if (contract) {
            // checkAdmin()
            // setLevels()
            // setTokens()
            getAllBenefits()
            getAllProvideTokens()

        }

        if (lvContract && lvContract.InquireUserNFT) {

            // checkLevel()
        }
    }, [contract, lvContract]);

    useEffect(() => {

        if (currentAccount && contract) {
            // getUserBenefits()
        }

        let interval = window.setInterval(() => {
            getETHFeed()
            getTokenFeed()

        }, 5000)

        return () => {
            clearInterval(interval)
        }

    }, [contract, currentAccount])


    return (
        <Container>
            <div id="contact" className="contact">
                <Row>
                    <Col md={6}>
                        <div className="main_form">
                            <Row>
                                <Col sm={12}>
                                    <select onChange={e => setCurrency(e.target.value)} placeholder='選擇要借出的貨幣' className='contactus'>{config.supportedToken.map((el, i) => <option value={el.tokenAddr} key={el.tokenAddr}>{el.symbol}</option>)}</select>
                                </Col>
                                <Col sm={12}>
                                    <input onChange={e => setAmount(e.target.value)} className="contactus" placeholder="您要作為抵押品的蝦幣數量" type="number" />
                                </Col>
                                <Col sm={12}>
                                    <input value={`您目前的抵押額度 : ${credit}`} className="contactus" readOnly type="text" />
                                    {/* <input value={`您目前的抵押額度 : ${userData?.userBenefits?.credit?.toNumber() ?? 0}`} className="contactus" readOnly type="text" /> */}
                                </Col>
                                <Col sm={12}>
                                    <button className="send" onClick={onDeposit}>送出借貸申請</button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='table_container'>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th>階級</th>
                                        <th>貸款成數</th>
                                        <th>年利率</th>
                                        <th>期限</th>
                                        <th>額度</th>
                                        <th>當前等級</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {benefits.map((benefit, i) => <tr key={benefit.validityTime} className={levelToBenefitsIdx[userData.userLevel] === i ? 'current-level' : ''}>
                                        <td><img src={levelToImg[benefitsIdxToLevel[i]]} /></td>
                                        <td>{benefit.ratio}</td>
                                        <td>{benefit.apr}</td>
                                        <td>{moment.unix(benefit.validityTime.toNumber()).format()}</td>
                                        <td>{benefit.credit.toNumber()}</td>
                                        {levelToBenefitsIdx[userData.userLevel] === i && <td>你在這</td>}
                                    </tr>)}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </div>
            <div id="contact" className="contact">
                <Row>
                    <div className='table_container'>
                        <h6 className='ml-1'>ChainLink - 即時牌價</h6>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Symbol</th>
                                    <th>Price ( Shrimp token )</th>
                                    <th>Price ( USD )</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(priceList).map(([key, value], i) => <tr key={key}>
                                    <td>{i + 1}</td>
                                    <td>{key}</td>
                                    <td>{value[0].toNumber()}</td>
                                    <td>{value[0].toNumber() / 10 ** value[1]}</td>
                                </tr>)}
                            </tbody>
                        </Table>
                    </div>

                </Row>
            </div>
            <div id="contact" className="contact">
                <Row>
                    <div className='table_container'>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>使用利率</th>
                                    <th>借款日期</th>
                                    <th>保證金數量</th>
                                    <th>借出數量</th>
                                    <th>借出貨幣地址</th>
                                    <th>動作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loan.map((el, i) =>
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td>{el.apr}</td>
                                        <td>{el.date}</td>
                                        <td>{el.stake}</td>
                                        <td>{el.eth}</td>
                                        <td></td>
                                        <td><button className='paybackbtn'>歸還此筆貸款</button></td>
                                    </tr>)
                                }
                            </tbody>
                        </Table>
                    </div>
                </Row>
            </div>
        </Container>


    )
}

export default Staking