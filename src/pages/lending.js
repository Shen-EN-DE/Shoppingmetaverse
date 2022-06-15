import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
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

const SssssmokinFinance = require('../solidity/artifacts/contracts/SssssmokinFinance.sol/SssssmokinFinance.json')
const CONTRACT_ABI = SssssmokinFinance.abi
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const Lending = () => {
    const provider = useProvider();
    // const { data: addedPT, isError: mintError, isLoading: isMintLoading, write: addProvideTokens } = useContractWrite(
    //     {
    //         addressOrName: CONTRACT_ADDRESS,
    //         contractInterface: CONTRACT_ABI,
    //     },
    //     'addProvideTokens'
    // )
    // const { data: addedBF, write: setBenifist } = useContractWrite(
    //     {
    //         addressOrName: CONTRACT_ADDRESS,
    //         contractInterface: CONTRACT_ABI,
    //     },
    //     'setBenifist'
    // )

    const { data: dd } = useContractRead(
        {
            addressOrName: CONTRACT_ADDRESS,
            contractInterface: CONTRACT_ABI,
            signerOrProvider: provider,
        },
        'getBenifits',
        { watch: true },
    )

    console.log(dd)


    // useEffect(() => {
    // if (setBenifist) Promise.all(config.memberBenefits.map((bf, i) => setBenifist({ args: [i + 1, bf] })));
    // if (addProvideTokens) Promise.all(config.supportedToken.map((token) => addProvideTokens({ args: token })))
    // const add = async () => await addProvideTokens({ args: [] })
    // add()

    // }, [setBenifist, addProvideTokens])

    return (
        <div className='Services'>
            <Container>
                lendingService
            </Container>

        </div>
    )
}

export default Lending