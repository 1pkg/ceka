global = Object.assign(global, require('./helper'))

const Master = artifacts.require('Master')
const CEKA = artifacts.require('CEKA')

contract('CEKA', async accounts => {
    contract('Constraints', async accounts => {
        let ceka = null
        beforeEach(async () => {
            // initialize ceka
            let master = await Master.new()
            await master.send(100 * FINNEY)
            await master.create('s_u')
            let addr = await master.get.call('s_u', true)
            ceka = await CEKA.at(addr[0])
        })

        it('should not accept put non limit amount', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            // put less than min put amnt
            try {
                await ceka.put.sendTransaction({ value: 9 * SZABO })
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid put value, amount breaks min/max contract constraint',
                )
            }

            // put greater than max put amnt
            try {
                await ceka.put.sendTransaction({ value: 2 * ETHER })
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid put value, amount breaks min/max contract constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
        })

        it('should not accept put time delta constraint', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            // put first time - success
            await ceka.put.sendTransaction({ value: 50 * SZABO })

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY + 50 * SZABO)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 50 * SZABO)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 50 * SZABO,
            )

            // put second time breaks time delta constraint
            try {
                await ceka.put.sendTransaction({ value: 150 * SZABO })
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid put now, time_stamp breaks min put delta constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY + 50 * SZABO)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 50 * SZABO)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 50 * SZABO,
            )
        })

        it('should not accept put after finish', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            await timeGap(55 * HOURS) // travel via 55 hours

            // put after ceka finish
            try {
                await ceka.put.sendTransaction({ value: 100 * SZABO })
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid put now, time_stamp breaks expiration contract constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
        })

        it('should not accept get without put', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            await timeGap(55 * HOURS) // travel via 55 hours

            // get without put
            try {
                await ceka.get()
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid get addr, address breaks known participiant get contract constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
        })

        it('should not accept get before finish', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            await ceka.put.sendTransaction({ value: 100 * SZABO })

            // get before ceka finish
            try {
                await ceka.get()
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid get now, time_stamp breaks expiration contract constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY + 100 * SZABO)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 100 * SZABO)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 100 * SZABO,
            )
        })

        it('should not accept double get', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            // get first time - success
            await ceka.put.sendTransaction({ value: 100 * SZABO })
            await timeGap(55 * HOURS) // travel via 55 hours
            await ceka.get()

            // double get - fail
            try {
                await ceka.get()
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid get prcsd flag, processed breaks single get contract constraint',
                )
            }
        })

        it('should not accept leave without put', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            // leave without put
            try {
                await ceka.leave()
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid leave addr, address breaks known participiant leave contract constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
        })

        it('should not accept leave after finish', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            await ceka.put.sendTransaction({ value: 100 * SZABO })
            await timeGap(55 * HOURS) // travel via 55 hours

            // leave after ceka finish
            try {
                await ceka.leave()
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid leave now, time_stamp breaks expiration contract constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY + 100 * SZABO)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 100 * SZABO)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 100 * SZABO,
            )
        })

        it('should not accept double leave', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            // leave first time - success
            await ceka.put.sendTransaction({ value: 100 * SZABO })
            await ceka.leave()

            // double leave - fail
            try {
                await ceka.leave()
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(
                    error.message,
                    'Invalid leave prcsd flag, processed breaks single leave contract constraint',
                )
            }

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY + 100 * SZABO)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 50 * SZABO)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 50 * SZABO,
            )
        })
    })

    contract('Proceed', async accounts => {
        let master = null
        let ceka = null
        beforeEach(async () => {
            // initialize ceka
            master = await Master.new()
            await master.send(100 * FINNEY)
            await master.create('s_u')
            let addr = await master.get.call('s_u', true)
            ceka = await CEKA.at(addr[0])
        })

        it('should correctly proceed single put', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            // put single time
            await ceka.put.sendTransaction({
                value: 450 * SZABO,
                from: accounts[0],
            })

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY + 450 * SZABO)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 450 * SZABO)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 450 * SZABO,
            )

            let result = await ceka.top.call(1)
            assert.equal(result[0][0], accounts[0])
            assert.equal(result[1][0], 450 * SZABO)
        })

        it('should correctly proceed several put', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            // put several times
            await ceka.put.sendTransaction({
                value: 50 * SZABO,
                from: accounts[0],
            })
            await ceka.put.sendTransaction({
                value: 150 * SZABO,
                from: accounts[1],
            })
            await ceka.put.sendTransaction({
                value: 250 * SZABO,
                from: accounts[2],
            })
            await timeGap(10 * MINUTES) // travel via 10 minutes
            await ceka.put.sendTransaction({
                value: 210 * SZABO,
                from: accounts[0],
            })

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(
                await ceka.amntTotal.call(),
                10 * FINNEY + (50 + 150 + 250 + 210) * SZABO,
            )
            assert.equal(
                await ceka.amntClean.call(),
                10 * FINNEY + (50 + 150 + 250 + 210) * SZABO,
            )
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + (50 + 150 + 250 + 210) * SZABO,
            )

            let result = await ceka.top.call(3)
            assert.equal(result[0][0], accounts[0])
            assert.equal(result[1][0], 260 * SZABO)
            assert.equal(result[0][1], accounts[2])
            assert.equal(result[1][1], 250 * SZABO)
            assert.equal(result[0][2], accounts[1])
            assert.equal(result[1][2], 150 * SZABO)
        })

        it('should correctly proceed single leave', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
            let initBalance = 1 * (await web3.eth.getBalance(accounts[1]))

            // put than leave
            await ceka.put.sendTransaction({
                value: 100 * FINNEY,
                from: accounts[1],
            })
            await ceka.leave.sendTransaction({
                from: accounts[1],
            })

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(
                await ceka.amntTotal.call(),
                10 * FINNEY + 100 * FINNEY,
            )
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 50 * FINNEY)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 50 * FINNEY,
            )
            let curBalance = 1 * (await web3.eth.getBalance(accounts[1]))
            assert.approximately(
                initBalance,
                curBalance + 50 * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )

            // witdraw should be proceed only once
            await timeGap(55 * HOURS) // travel via 55 hours
            await ceka.finish()

            // check props
            let curBalanceNew = 1 * (await web3.eth.getBalance(accounts[1]))
            assert.approximately(curBalance, curBalanceNew, SZABO)
        })

        it('should correctly proceed several leave', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
            let initBalance1 = 1 * (await web3.eth.getBalance(accounts[1]))
            let initBalance2 = 1 * (await web3.eth.getBalance(accounts[2]))
            let initBalance3 = 1 * (await web3.eth.getBalance(accounts[2]))

            // put than leave
            await ceka.put.sendTransaction({
                value: 100 * FINNEY,
                from: accounts[1],
            })
            await ceka.leave.sendTransaction({
                from: accounts[1],
            })
            await ceka.put.sendTransaction({
                value: 150 * FINNEY,
                from: accounts[2],
            })
            await ceka.put.sendTransaction({
                value: 200 * FINNEY,
                from: accounts[3],
            })
            await ceka.leave.sendTransaction({
                from: accounts[2],
            })
            await ceka.leave.sendTransaction({
                from: accounts[3],
            })

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(
                await ceka.amntTotal.call(),
                10 * FINNEY + (100 + 150 + 200) * FINNEY,
            )
            assert.equal(
                await ceka.amntClean.call(),
                10 * FINNEY + 225 * FINNEY,
            )
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 225 * FINNEY,
            )
            let curBalance1 = 1 * (await web3.eth.getBalance(accounts[1]))
            assert.approximately(
                initBalance1,
                curBalance1 + 50 * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )
            let curBalance2 = 1 * (await web3.eth.getBalance(accounts[2]))
            assert.approximately(
                initBalance2,
                curBalance2 + 75 * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )
            let curBalance3 = 1 * (await web3.eth.getBalance(accounts[3]))
            assert.approximately(
                initBalance3,
                curBalance3 + 100 * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )

            // witdraw should be proceed only once
            await timeGap(55 * HOURS) // travel via 55 hours
            await ceka.finish()

            // check props
            let curBalanceNew1 = 1 * (await web3.eth.getBalance(accounts[1]))
            assert.approximately(curBalance1, curBalanceNew1, SZABO)
            let curBalanceNew2 = 1 * (await web3.eth.getBalance(accounts[2]))
            assert.approximately(curBalance2, curBalanceNew2, SZABO)
            let curBalanceNew3 = 1 * (await web3.eth.getBalance(accounts[3]))
            assert.approximately(curBalance3, curBalanceNew3, SZABO)

            let result = await ceka.top.call(3)
            assert.equal(result[0][0], accounts[3])
            assert.equal(result[1][0], 200 * FINNEY)
            assert.equal(result[0][1], accounts[2])
            assert.equal(result[1][1], 150 * FINNEY)
            assert.equal(result[0][2], accounts[1])
            assert.equal(result[1][2], 100 * FINNEY)
        })

        it('should correctly proceed single get', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
            let initBalanceUser = 1 * (await web3.eth.getBalance(accounts[1]))
            let initBalanceMaster =
                1 * (await web3.eth.getBalance(master.address))
            let initBalanceOwner = 1 * (await web3.eth.getBalance(accounts[0]))

            // put than get
            await ceka.put.sendTransaction({
                value: 100 * FINNEY,
                from: accounts[1],
            })
            await timeGap(55 * HOURS) // travel via 55 hours
            await ceka.get.sendTransaction({
                from: accounts[1],
            })

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(
                await ceka.amntTotal.call(),
                10 * FINNEY + 100 * FINNEY,
            )
            assert.approximately(
                1 * (await ceka.amntClean.call()).toString(),
                67 * FINNEY,
                FINNEY,
            )
            assert.approximately(
                1 * (await ceka.amntCurrent.call()).toString(),
                34 * FINNEY,
                FINNEY,
            )
            let curBalanceUser = 1 * (await web3.eth.getBalance(accounts[1]))
            assert.approximately(
                initBalanceUser,
                curBalanceUser + (100 - 33) * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )
            let curBalanceMaster =
                1 * (await web3.eth.getBalance(master.address))
            assert.approximately(
                initBalanceMaster,
                curBalanceMaster - 27.5 * FINNEY,
                FINNEY,
            )
            let curBalanceOwner = 1 * (await web3.eth.getBalance(accounts[0]))
            assert.approximately(
                initBalanceOwner,
                curBalanceOwner - 15.5 * FINNEY,
                FINNEY,
            )
        })

        it('should correctly proceed several get', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
            let initBalanceUser1 = 1 * (await web3.eth.getBalance(accounts[1]))
            let initBalanceUser2 = 1 * (await web3.eth.getBalance(accounts[2]))
            let initBalanceUser3 = 1 * (await web3.eth.getBalance(accounts[3]))
            let initBalanceMaster =
                1 * (await web3.eth.getBalance(master.address))
            let initBalanceOwner = 1 * (await web3.eth.getBalance(accounts[0]))

            // put than get
            await ceka.put.sendTransaction({
                value: 100 * FINNEY,
                from: accounts[1],
            })
            await ceka.put.sendTransaction({
                value: 200 * FINNEY,
                from: accounts[2],
            })
            await ceka.put.sendTransaction({
                value: 300 * FINNEY,
                from: accounts[3],
            })
            await timeGap(55 * HOURS) // travel via 55 hours
            await ceka.get.sendTransaction({
                from: accounts[1],
            })
            await ceka.get.sendTransaction({
                from: accounts[2],
            })
            await ceka.get.sendTransaction({
                from: accounts[3],
            })

            // check top
            let result = await ceka.top.call(3)
            assert.equal(result[0][0], accounts[3])
            assert.equal(result[1][0], 300 * FINNEY)
            assert.equal(result[0][1], accounts[2])
            assert.equal(result[1][1], 200 * FINNEY)
            assert.equal(result[0][2], accounts[1])
            assert.equal(result[1][2], 100 * FINNEY)

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(
                await ceka.amntTotal.call(),
                10 * FINNEY + (100 + 200 + 300) * FINNEY,
            )
            assert.approximately(
                1 * (await ceka.amntClean.call()).toString(),
                436 * FINNEY,
                FINNEY,
            )
            assert.approximately(
                1 * (await ceka.amntCurrent.call()).toString(),
                69 * FINNEY,
                FINNEY,
            )

            let curBalanceUser1 = 1 * (await web3.eth.getBalance(accounts[1]))
            assert.approximately(
                initBalanceUser1,
                curBalanceUser1 + (100 - 41 - 27) * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )
            let curBalanceUser2 = 1 * (await web3.eth.getBalance(accounts[2]))
            assert.approximately(
                initBalanceUser2,
                curBalanceUser2 + (200 - 82 - 27) * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )
            let curBalanceUser3 = 1 * (await web3.eth.getBalance(accounts[3]))
            assert.approximately(
                initBalanceUser3,
                curBalanceUser3 + (300 - 163.5 - 27) * FINNEY,
                10 * FINNEY, // cause of all gas operations
            )

            let curBalanceMaster =
                1 * (await web3.eth.getBalance(master.address))
            assert.approximately(
                initBalanceMaster,
                curBalanceMaster - 152.5 * FINNEY,
                FINNEY,
            )
            let curBalanceOwner = 1 * (await web3.eth.getBalance(accounts[0]))
            assert.approximately(
                initBalanceOwner,
                curBalanceOwner - 21.5 * FINNEY,
                FINNEY,
            )
        })
    })
})
