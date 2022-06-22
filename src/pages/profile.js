import React, { useEffect, useState, useContext } from 'react'
import moment from 'moment';
import { Container, Row, Col, Table } from 'react-bootstrap'

import { config } from '../config'
import { BlockchainContext } from "../components/context/blockChainCtx";
import { ethers } from 'ethers';

import gold from '../style/images/gs.png'
import silver from '../style/images/ss.png'
import bronze from '../style/images/cs.png'


const SssssmokinFinance = require('../solidity/artifacts/contracts/SssssmokinFinance.sol/SssssmokinFinance.json')
const LEVELS = require('../solidity/artifacts/contracts/ShrimpNFT.sol/ShrimpNFT.json')
const SP = require('../solidity/artifacts/contracts/ShrimpToken.sol/ShrimpToken.json')

const LEVELS_ABI = LEVELS.abi
const LEVELS_ADDRESS = '0x4B1Da04F722a53DC559C62B05f79ce009b5F7b7d'
// should use require

const SERVICE_ABI = SssssmokinFinance.abi
const SERVICE_ADDRESS = '0xd1BdC856bA66B325B9470543dbBbcd4EAED5008F'

const SP_ABI = SP.abi
const SP_ADDRESS = '0x6E09231eD9f490E44EB7d9BBE117b2aE57b6273A'

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

const Profile = () => {

    const { currentAccount, provider, networkId, chainId } = useContext(BlockchainContext);
    const [contracts, setContracts] = useState()
    const [userStatus, setUserStatus] = useState({
        userSpAmount: 350,
        userLevel: 'Copper',
        userCredit: 200000
    })
    const [benefits, setBenefits] = useState([])
    const [buySPAmount, setBuyAmount] = useState()

    //  actions
    //      buy SP
    //      exchange nft with SP
    //      query nft
    //  view
    //      show SP amount
    //      show nft level
    //      show benefit

    const buySP = async () => {
        try {
            const res = await contracts.spContract.GiveToken('0x8329857f3d2a19f94186Bd6F62Bfc480de2dC528', 100)

        } catch (error) {
            console.error(error)

        }

    }

    const mintBronze = async () => {
        const res = await contracts.spContract.devMintBronze()
    }

    const mintSilver = async () => {
        const res = await contracts.spContract.devMintSilver()
    }

    const mintGolden = async () => {
        const res = await contracts.spContract.devMintGolden()
    }

    const getAllBenefits = async () => {
        try {
            const _allBenefits = await contracts.serviceContract.getAllBenefits();
            setBenefits(_allBenefits);
        } catch (error) {
            console.log(error)
        }

    }

    const getSPAmount = async () => {
        try {
            const res = await contracts.spContract.balanceOf(currentAccount)
            setUserStatus(prev => ({
                ...prev,
                userSpAmount: res
            }))

        } catch (error) {
            console.error(error)

        }

    }

    const claimNFT = async () => {
        try {
            const res = await contracts.lvContract.GetNFT()
            setTimeout(() => {

                setUserStatus(prev => ({
                    ...prev,
                    userSpAmount: 350,
                    userLevel: 'Silver',
                    userCredit: 100000
                }))
                alert('You got Silver_Shrimp')
            }, 3500)


        } catch (error) {
            console.error(error)
        }

    }

    const checkLevel = async () => {
        try {
            const res = await contracts.lvContract.InquireUserNFT(currentAccount)

            setUserStatus(prev => ({
                ...prev,
                userLevel: res
            }))

        } catch (error) {
            console.error(error)
        }

    }

    const getUserBenefits = async () => {
        try {
            const userb = await contracts.serviceContract.getUserBenefits(currentAccount)
            setUserStatus(prev => ({
                ...prev,
                userBenefits: userb
            }))
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        if (provider) {

            const signer = provider.getSigner();
            provider.getBlock().then(block => {
                const a = new ethers.Contract(LEVELS_ADDRESS, LEVELS_ABI, provider, {
                    gasLimit: block.gasLimit
                });

                setContracts(prev => ({
                    ...prev,
                    lvContract: a.connect(signer)
                }));
                const b = new ethers.Contract(SP_ADDRESS, SP_ABI, provider, {
                    gasLimit: block.gasLimit
                });
                setContracts(prev => ({
                    ...prev,
                    spContract: b.connect(signer)
                }));

                const c = new ethers.Contract(SERVICE_ADDRESS, SERVICE_ABI, provider, {
                    gasLimit: block.gasLimit
                });
                setContracts(prev => ({
                    ...prev,
                    serviceContract: c.connect(signer)
                }));
            })
        }
    }, [provider]);

    useEffect(() => {

        if (currentAccount && contracts?.serviceContract) {
            getUserBenefits()
            getAllBenefits()
        }

        if (currentAccount && contracts?.lvContract) {
            // console.log(contracts.lvContract)
            // claimNFT()
            // checkLevel()
        }
        if (currentAccount && contracts?.spContract) {
            //  getSPAmount()
        }

    }, [contracts, currentAccount])


    return (
        <Container>
            <div id="contact" className="contact">
                <Row>
                    <Col md={6}>
                        <div className='table_container'>
                            <h5>我擁有的會員階級證:</h5>
                            {userStatus.userLevel === 'Copper' && <img className='medal' src={bronze}></img>}
                            {userStatus.userLevel === 'Silver' && <img className='medal' src={silver}></img>}
                            <h6 className='ml-2'>{userStatus?.userLevel}</h6>
                            <div className='btn-group-right'>

                                <button className='read_more' onClick={() => {
                                    claimNFT()
                                    // checkLevel()
                                }}>更新會員階級證</button>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='table_container'>
                            <h5>我擁有的Shrimp Token數量:</h5>
                            <h6>{userStatus?.userSpAmount?.toString()}</h6>
                            <h5>我擁有的額度:</h5>
                            <h6>{userStatus?.userCredit}</h6>
                            <h5>你要購買的Shrimp Token數量</h5>
                            <input onChange={e => setBuyAmount(e.target.value)} className='contactus w-50' type='number' placeholder='WEI'></input>
                            <div className='btn-group-right'>

                                <button className='read_more' onClick={buySP} >一鍵購買</button>

                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div id="contact" className="contact">
                <Row>
                    <Col>
                        <div className='table_container'>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th onClick={mintBronze}>階級</th>
                                        <th onClick={mintSilver}>貸款成數</th>
                                        <th onClick={mintGolden}>年利率</th>
                                        <th>期限</th>
                                        <th>貸款額度</th>
                                        <th>當前等級</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {benefits.map((benefit, i) => <tr key={benefit.validityTime} className={levelToBenefitsIdx[userStatus?.userLevel] === i ? 'current-level' : ''}>
                                        <td><img src={levelToImg[benefitsIdxToLevel[i]]} /></td>
                                        <td>{benefit.ratio}</td>
                                        <td>{benefit.apr}</td>
                                        <td>{moment.unix(benefit.validityTime.toNumber()).format()}</td>
                                        <td>{benefit.credit.toNumber()}</td>
                                        {levelToBenefitsIdx[userStatus?.userLevel] === i && <td>你在這</td>}
                                    </tr>)}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default Profile