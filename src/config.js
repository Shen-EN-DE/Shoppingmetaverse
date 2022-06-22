import moment from "moment";

export const config = {
    infuraId: '61215055bc184343a0c558fde59fa107',
    supportedToken: [{ tokenAddr: '0x030b0a08eCaDdE5Ac33859a48d87416946C966A1', symbol: 'BNB' },
    { tokenAddr: '0xD2084eA2AE4bBE1424E4fe3CDE25B713632fb988', symbol: 'BAT' },
    // { tokenAddr: '0xbbEB7c67fa3cfb40069D19E598713239497A3CA5', symbol: 'COMP' },
    { tokenAddr: '', symbol: 'ETH' },
    ],
    chainLink: ['0xcf0f51ca2cDAecb464eeE4227f5295F2384F84ED',
        '0x031dB56e01f82f20803059331DC6bEe9b17F7fC9',
        //    '0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5'
    ],
    memberBenefits: {
        Copper: {
            ratio: 50,
            apr: 9,
            validityTime: moment().add(7, 'd').unix(),
            credit: 10000000
        },
        Silver: {
            ratio: 60,
            apr: 8,
            validityTime: moment().add(8, 'd').unix(),
            credit: 20000000
        },
        Golden: {
            ratio: 70,
            apr: 7,
            validityTime: moment().add(9, 'd').unix(),
            credit: 30000000
        },
    }
}
// sup: usdt, curve, aave

// struct Benefits {
//     // 貸款成數
//     uint32 ratio;
//     // 年利率
//     uint32 apr;
//     // 有效期 Timestamp
//     uint64 validityTime;
//     // 額度
//     uint128 credit;
// }
