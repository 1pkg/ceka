const crypto = require('crypto')
const ethUtils = require('ethereumjs-util')

const SZABO = 1e12
const FINNEY = 1e15
const ETHER = 1e18

const MINUTES = 60
const HOURS = 60 * MINUTES

const ADDR_NULL = '0X0000000000000000000000000000000000000000'

const timeGap = async time => {
    await new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [time],
                id: new Date().getTime(),
            },
            (err, result) => {
                if (err) {
                    return reject(err)
                }
                return resolve(result)
            },
        )
    })
    await new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: '2.0',
                method: 'evm_mine',
                id: new Date().getTime(),
            },
            (err, result) => {
                if (err) {
                    return reject(err)
                }
                const newBlockHash = web3.eth.getBlock('latest').hash
                return resolve(newBlockHash)
            },
        )
    })
    return Promise.resolve(web3.eth.getBlock('latest'))
}

const rndAddr = () => {
    return (
        '0x' + ethUtils.privateToAddress(crypto.randomBytes(32)).toString('hex')
    )
}

module.exports = {
    SZABO,
    FINNEY,
    ETHER,

    MINUTES,
    HOURS,

    ADDR_NULL,

    timeGap,
    rndAddr,
}
