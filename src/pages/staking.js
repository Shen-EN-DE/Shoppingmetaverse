import React, { useEffect, useContext, useState } from 'react'
import { config } from '../config'
import { BlockchainContext } from "../components/context/blockChainCtx";
import { ethers } from 'ethers';

import { DropdownButton, Dropdown, Col, Row, Container, Table } from 'react-bootstrap'

const SssssmokinFinance = require('../solidity/artifacts/contracts/SssssmokinFinance.sol/SssssmokinFinance.json')
const CONTRACT_ABI = SssssmokinFinance.abi
const CONTRACT_ADDRESS = '0xBCBC290FF335F0cAed7ce0Ed623cCEE294aa5074'

const Staking = () => {

    const { currentAccount, provider, networkId, chainId } = useContext(BlockchainContext);
    const [contract, setContract] = useState();
    const [benefits, setBenefits] = useState([])

    useEffect(() => {
        if (provider) {
            const signer = provider.getSigner();
            provider.getBlock().then(block => {
                const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider, {
                    gasLimit: block.gasLimit
                });

                setContract(_contract.connect(signer));

            })
        }

    }, [provider]);

    useEffect(() => {

        const getAllBenefits = async () => {
            const _allBenefits = await contract.getAllBenefits();
            setBenefits(_allBenefits);
        }
        const setTokenIdOrder = async () => {


            await contract.setTokenIdOrder(
                [0, 1, 2, 3]
            );
            // await contract.setBenefits(
            //     2,
            //     config.memberBenefits[2]
            // );
            // await contract.setBenefits(
            //     3,
            //     config.memberBenefits[3]
            // );

        }

        const getBenefits = async () => {
            const b = await contract.tokenIdOrder()
            console.log(b)
        }

        const setTokens = async () => {
            const c = await contract.setProvideTokens(config.supportedToken[0], config.chainLink[0])
            const b = await contract.setProvideTokens(config.supportedToken[1], config.chainLink[1])
            const d = await contract.setProvideTokens(config.supportedToken[2], config.chainLink[2])
        }

        const getAllProvideTokens = async () => {
            const b = await contract.getAllProvideTokens()
            console.log(b)
        }

        if (contract) {
            // setTokenIdOrder()
            getAllBenefits()
            // getBenefits()
            // setTokens()
            getAllProvideTokens()
        }
    }, [contract]);

    // const { data: addedPT, isError: mintError, isLoading: isMintLoading, write: setProvideTokens } = useContractWrite(
    //     {
    //         addressOrName: CONTRACT_ADDRESS,
    //         contractInterface: CONTRACT_ABI,
    //     },
    //     'setProvideTokens'
    // )

    // const [{ }, setBenifist] = useContractWrite(
    //     {
    //         addressOrName: CONTRACT_ADDRESS,
    //         contractInterface: CONTRACT_ABI,
    //         signerOrProvider: provider,
    //     },
    //     "setBenifist"
    // )



    return (
        <Container>
            <div id="contact" className="contact">
                <Row>
                    <Col md={6}>
                        <form className="main_form">
                            <Row>
                                <Col sm={12}>
                                    <select placeholder='選擇抵押貨幣種類' className='contactus'>{config.supportedToken.map((el, i) => <option key={`${el}-${i}`}>{el}</option>)}</select>

                                </Col>
                                <Col sm={12}>
                                    <input className="contactus" placeholder="How much token you want to stake" type="number" />
                                </Col>
                                <Col sm={12}>
                                    <input className="contactus" placeholder="How much you want to borrow" type="number" />
                                </Col>
                                <Col sm={12}>
                                    <input className="contactus" placeholder="您目前擁有的額度" readOnly type="number" />
                                </Col>
                                <Col sm={12}>
                                    <button className="send">Send</button>
                                </Col>
                            </Row>
                        </form>
                    </Col>
                    <Col md={6}>
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
                                <tr className='currentLevel'>
                                    <td>銅</td>
                                    <td>0.5</td>
                                    <td>1234</td>
                                    <td>10000 USDT</td>
                                    <td>1 BTC</td>
                                    <td>你在這</td>
                                </tr>
                                <tr>
                                    <td>銀</td>
                                    <td>0.5</td>
                                    <td>1234</td>
                                    <td>10000 USDT</td>
                                    <td>1 BTC</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>金</td>
                                    <td>0.5</td>
                                    <td>1234</td>
                                    <td>10000 USDT</td>
                                    <td>1 BTC</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>

                    </Col>
                </Row>
            </div>
            <div id="contact" className="contact">
                <Row>
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
                            <tr>
                                <td>1</td>
                                <td>0.5</td>
                                <td>1234</td>
                                <td>10000 USDT</td>
                                <td>1 BTC</td>
                                <td>0x834975393466787876</td>
                                <td><button className='paybackbtn'>歸還此筆貸款</button></td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>0.5</td>
                                <td>1234</td>
                                <td>10000 USDT</td>
                                <td>1 BTC</td>
                                <td>0x834975393466787876</td>
                                <td><button className='paybackbtn'>歸還此筆貸款</button></td>
                            </tr>
                        </tbody>
                    </Table>
                </Row>
            </div>
        </Container>


    )
}

export default Staking