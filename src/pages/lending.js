import React, { useEffect } from 'react'
import { config } from '../config'
import {
    useConnect,
    useAccount,
    useNetwork,
    useDisconnect,
    useContractRead,
    useContractWrite,
    chain,
    useProvider
} from 'wagmi'
import { DropdownButton, Dropdown, Col, Row, Container, Table } from 'react-bootstrap'

const SssssmokinFinance = require('../solidity/artifacts/contracts/SssssmokinFinance.sol/SssssmokinFinance.json')
const CONTRACT_ABI = SssssmokinFinance.abi
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const Lending = () => {
    const { data: addedPT, isError: mintError, isLoading: isMintLoading, write: addProvideTokens } = useContractWrite(
        {
            addressOrName: CONTRACT_ADDRESS,
            contractInterface: CONTRACT_ABI,
        },
        'addProvideTokens'
    )
    const { data: addedBF, write: setBenifist } = useContractWrite(
        {
            addressOrName: CONTRACT_ADDRESS,
            contractInterface: CONTRACT_ABI,
        },
        'setBenifist'
    )

    // const { data: dd } = useContractRead(
    //     {
    //         addressOrName: CONTRACT_ADDRESS,
    //         contractInterface: CONTRACT_ABI
    //     },
    //     'test',
    //     { watch: true },
    //     { args: 0 }
    // )

    useEffect(() => {
        // if (setBenifist) Promise.all(config.memberBenefits.map((bf, i) => setBenifist({ args: [i + 1, bf] })));
        // if (addProvideTokens) Promise.all(config.supportedToken.map((token) => addProvideTokens({ args: token })))

    }, [])

    return (
        <Container>
            <div id="contact" className="contact">
                <Row>
                    <Col md={6}>
                        <form className="main_form">
                            <Row>
                                <Col sm={12}>
                                    <select placeholder='選擇抵押貨幣種類' className='contactus'>{config.supportedToken.map(el => <option key={el}>{el}</option>)}</select>

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

export default Lending