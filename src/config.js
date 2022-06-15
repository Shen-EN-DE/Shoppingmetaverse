import moment from "moment";


export const config = {
    supportedToken: ['0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        '0xD533a949740bb3306d119CC777fa900bA034cd52',
        '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'],
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
        // {
        //     ratio: 70,
        //     apr: 7,
        //     validityTime: moment().add(9, 'd').unix(),
        //     credit: 2
        // }, {
        //     ratio: 80,
        //     apr: 6,
        //     validityTime: moment().add(10, 'd').unix(),
        //     credit: 2
        // },
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
