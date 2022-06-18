import moment from "moment";


export const config = {
    infuraId: '61215055bc184343a0c558fde59fa107',
    supportedToken: ['0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        '0xD533a949740bb3306d119CC777fa900bA034cd52',
        '0x514910771AF9Ca656af840dff83E8264EcF986CA'],
    chainLink: ['0x547a514d5e3769680Ce22B2361c10Ea13619e8a9',
        '0x9441D7556e7820B5ca42082cfa99487D56AcA958',
        '0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f'],
    memberBenefits: [{
        ratio: 50,
        apr: 9,
        validityTime: moment().add(7, 'd').unix(),
        credit: 1
    },
    {
        ratio: 60,
        apr: 8,
        validityTime: moment().add(8, 'd').unix(),
        credit: 1
    },
    {
        ratio: 70,
        apr: 7,
        validityTime: moment().add(9, 'd').unix(),
        credit: 2
    }, {
        ratio: 80,
        apr: 6,
        validityTime: moment().add(10, 'd').unix(),
        credit: 2
    },
    ]
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
