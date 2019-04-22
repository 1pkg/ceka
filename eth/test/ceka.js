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

        it('should not accept put less than min put amount', async () => {
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

    contract('Simple', async accounts => {
        let ceka = null
        beforeEach(async () => {
            // initialize ceka
            let master = await Master.new()
            await master.send(100 * FINNEY)
            await master.create('s_u')
            let addr = await master.get.call('s_u', true)
            ceka = await CEKA.at(addr[0])
        })

        it('should accept single put', async () => {
            // check inital props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)

            await ceka.put.sendTransaction({ value: 50 * SZABO })

            // check props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY + 50 * SZABO)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY + 50 * SZABO)
            assert.equal(
                await ceka.amntCurrent.call(),
                10 * FINNEY + 50 * SZABO,
            )
        })
    })
})
