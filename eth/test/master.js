global = Object.assign(global, require('./helper'))

const Master = artifacts.require('Master')
const CEKA = artifacts.require('CEKA')

contract('Master', async accounts => {
    contract('Presets', async accounts => {
        let master = null
        before(async () => {
            // initialize master
            master = await Master.new()
            await master.send(5 * ETHER)
        })

        it('should create small usual ceka', async () => {
            // create s_u ceka
            await master.create('s_u')
            let addr = await master.get.call('s_u', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check s_u props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 6 * MINUTES)
            assert.equal(await ceka.putAmntMin.call(), 10 * SZABO)
            assert.equal(await ceka.putAmntMax.call(), 1 * ETHER)
            assert.equal(await ceka.rthRate.call(), 4)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 5)
            assert.equal(await ceka.saCount.call(), 25)
            assert.equal(await ceka.ssRate.call(), 4)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                50 * HOURS,
            )
        })

        it('should create small extra ceka', async () => {
            // create s_e ceka
            await master.create('s_e')
            let addr = await master.get.call('s_e', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check s_e props
            assert.equal(await ceka.amntInit.call(), 10 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 10 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 10 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 10 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 6 * MINUTES)
            assert.equal(await ceka.putAmntMin.call(), 10 * SZABO)
            assert.equal(await ceka.putAmntMax.call(), 1 * ETHER)
            assert.equal(await ceka.rthRate.call(), 4)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 5)
            assert.equal(await ceka.saCount.call(), 25)
            assert.equal(await ceka.ssRate.call(), 4)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                25 * HOURS,
            )
        })

        it('should create normal small ceka', async () => {
            // create n_s ceka
            await master.create('n_s')
            let addr = await master.get.call('n_s', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check n_s props
            assert.equal(await ceka.amntInit.call(), 25 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 25 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 25 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 25 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 6 * MINUTES)
            assert.equal(await ceka.putAmntMin.call(), 100 * SZABO)
            assert.equal(await ceka.putAmntMax.call(), 10 * ETHER)
            assert.equal(await ceka.rthRate.call(), 4)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 5)
            assert.equal(await ceka.saCount.call(), 25)
            assert.equal(await ceka.ssRate.call(), 4)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                100 * HOURS,
            )
        })

        it('should create normal usual ceka', async () => {
            // create n_u ceka
            await master.create('n_u')
            let addr = await master.get.call('n_u', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check n_u props
            assert.equal(await ceka.amntInit.call(), 25 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 25 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 25 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 25 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 6 * MINUTES)
            assert.equal(await ceka.putAmntMin.call(), 100 * SZABO)
            assert.equal(await ceka.putAmntMax.call(), 10 * ETHER)
            assert.equal(await ceka.rthRate.call(), 4)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 10)
            assert.equal(await ceka.saCount.call(), 100)
            assert.equal(await ceka.ssRate.call(), 4)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                100 * HOURS,
            )
        })

        it('should create normal common ceka', async () => {
            // create n_c ceka
            await master.create('n_c')
            let addr = await master.get.call('n_c', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check n_c props
            assert.equal(await ceka.amntInit.call(), 25 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 25 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 25 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 25 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 6 * MINUTES)
            assert.equal(await ceka.putAmntMin.call(), 100 * SZABO)
            assert.equal(await ceka.putAmntMax.call(), 10 * ETHER)
            assert.equal(await ceka.rthRate.call(), 10)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 10)
            assert.equal(await ceka.saCount.call(), 100)
            assert.equal(await ceka.ssRate.call(), 2)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                100 * HOURS,
            )
        })

        it('should create normal large ceka', async () => {
            // create n_l ceka
            await master.create('n_l')
            let addr = await master.get.call('n_l', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check n_l props
            assert.equal(await ceka.amntInit.call(), 100 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 100 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 100 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 100 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 6 * MINUTES)
            assert.equal(await ceka.putAmntMin.call(), 100 * SZABO)
            assert.equal(await ceka.putAmntMax.call(), 10 * ETHER)
            assert.equal(await ceka.rthRate.call(), 10)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 10)
            assert.equal(await ceka.saCount.call(), 100)
            assert.equal(await ceka.ssRate.call(), 2)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                500 * HOURS,
            )
        })

        it('should create normal extra ceka', async () => {
            // create n_e ceka
            await master.create('n_e')
            let addr = await master.get.call('n_e', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check n_e props
            assert.equal(await ceka.amntInit.call(), 100 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 100 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 100 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 100 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 6 * MINUTES)
            assert.equal(await ceka.putAmntMin.call(), 100 * SZABO)
            assert.equal(await ceka.putAmntMax.call(), 10 * ETHER)
            assert.equal(await ceka.rthRate.call(), 4)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 25)
            assert.equal(await ceka.saCount.call(), 250)
            assert.equal(await ceka.ssRate.call(), 4)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                500 * HOURS,
            )
        })

        it('should create large usual ceka', async () => {
            // create l_u ceka
            await master.create('l_u')
            let addr = await master.get.call('l_u', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check l_u props
            assert.equal(await ceka.amntInit.call(), 250 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 250 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 250 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 250 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 1 * HOURS)
            assert.equal(await ceka.putAmntMin.call(), 1 * FINNEY)
            assert.equal(await ceka.putAmntMax.call(), 100 * ETHER)
            assert.equal(await ceka.rthRate.call(), 4)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 25)
            assert.equal(await ceka.saCount.call(), 250)
            assert.equal(await ceka.ssRate.call(), 4)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                1000 * HOURS,
            )
        })

        it('should create large common ceka', async () => {
            // create l_c ceka
            await master.create('l_c')
            let addr = await master.get.call('l_c', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check l_c props
            assert.equal(await ceka.amntInit.call(), 250 * FINNEY)
            assert.equal(await ceka.amntTotal.call(), 250 * FINNEY)
            assert.equal(await ceka.amntClean.call(), 250 * FINNEY)
            assert.equal(await ceka.amntCurrent.call(), 250 * FINNEY)
            assert.equal(await ceka.putTsDelta.call(), 1 * HOURS)
            assert.equal(await ceka.putAmntMin.call(), 1 * FINNEY)
            assert.equal(await ceka.putAmntMax.call(), 100 * ETHER)
            assert.equal(await ceka.rthRate.call(), 10)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 10)
            assert.equal(await ceka.saCount.call(), 100)
            assert.equal(await ceka.ssRate.call(), 2)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                1000 * HOURS,
            )
        })

        it('should create large extra ceka', async () => {
            // create l_e ceka
            await master.create('l_e')
            let addr = await master.get.call('l_e', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // check l_e props
            assert.equal(await ceka.amntInit.call(), 1 * ETHER)
            assert.equal(await ceka.amntTotal.call(), 1 * ETHER)
            assert.equal(await ceka.amntClean.call(), 1 * ETHER)
            assert.equal(await ceka.amntCurrent.call(), 1 * ETHER)
            assert.equal(await ceka.putTsDelta.call(), 1 * HOURS)
            assert.equal(await ceka.putAmntMin.call(), 1 * FINNEY)
            assert.equal(await ceka.putAmntMax.call(), 100 * ETHER)
            assert.equal(await ceka.rthRate.call(), 20)
            assert.equal(await ceka.rthAddress.call(), master.address)
            assert.equal(await ceka.smCount.call(), 50)
            assert.equal(await ceka.saCount.call(), 500)
            assert.equal(await ceka.ssRate.call(), 8)
            assert.equal(await ceka.ssAddress.call(), accounts[0])
            assert.equal(
                (await ceka.tsFinish.call()) - (await ceka.tsStart.call()),
                5000 * HOURS,
            )
        })

        it('should not create any ceka', async () => {
            // bad preset
            try {
                await master.create('rnd')
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(error.message, 'Invalid name preset specified')
            }
            assert.deepEqual(await master.get.call('rnd', true), [])

            // bad preset
            try {
                await master.create('_l_e_')
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(error.message, 'Invalid name preset specified')
            }
            assert.deepEqual(await master.get.call('_l_e_', true), [])

            // bad preset
            try {
                await master.create('su')
                throw null
            } catch (error) {
                assert.isNotNull(error)
                assert.include(error.message, 'Invalid name preset specified')
            }
            assert.deepEqual(await master.get.call('su', true), [])
        })
    })

    contract('Wiped', async accounts => {
        let master = null
        beforeEach(async () => {
            // initialize master
            master = await Master.new()
            await master.send(100 * FINNEY)
        })

        it('should start as not can wipe', async () => {
            // can't be wiped here
            assert.isOk(await master.canwipe.call(), 'Can be wiped at start')

            await master.create('s_u')
            let addr = await master.get.call('s_u', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // can't be wiped here
            assert.isNotOk(
                await ceka.finish.call(),
                'Should have one running ceka',
            )
            assert.isNotOk(
                await master.canwipe.call(),
                'Cannot be wiped with running cekas',
            )
        })

        it('should became can wipe', async () => {
            // can't be wiped here
            assert.isOk(await master.canwipe.call(), 'Can be wiped at start')

            await master.create('s_u')
            let addr = await master.get.call('s_u', true)
            assert.lengthOf(addr, 1)

            let ceka = await CEKA.at(addr[0])

            // can't be wiped here
            assert.isNotOk(
                await ceka.finish.call(),
                'Should have one running ceka',
            )
            assert.isNotOk(
                await master.canwipe.call(),
                'Cannot be wiped after ceka create',
            )

            await timeGap(55 * HOURS) // travel via 55 hours

            // now it can be wiped
            assert.isOk(
                await ceka.finish.call(),
                'Should have none running ceka',
            )
            assert.isOk(
                await master.canwipe.call(),
                'Can be wiped after ceka finished',
            )
        })

        it('should not became can wipe mixed', async () => {
            // can't be wiped here
            assert.isOk(await master.canwipe.call(), 'Can be wiped at start')

            await master.create('s_u')
            await master.create('s_e')

            let addru = await master.get.call('s_u', true)
            let addre = await master.get.call('s_e', true)
            assert.lengthOf(addru, 1)
            assert.lengthOf(addre, 1)

            let cekau = await CEKA.at(addru[0])
            let cekae = await CEKA.at(addre[0])

            // can't be wiped here
            assert.isNotOk(
                await cekau.finish.call(),
                'Should have two running cekas',
            )
            assert.isNotOk(
                await cekae.finish.call(),
                'Should have two running cekas',
            )
            assert.isNotOk(
                await master.canwipe.call(),
                'Cannot be wiped after ceka create',
            )

            await timeGap(26 * HOURS) // travel via 26 hours

            // can't be wiped here
            assert.isOk(
                await cekae.finish.call(),
                'Should have one running ceka',
            )
            assert.isNotOk(
                await cekau.finish.call(),
                'Should have one running ceka',
            )
            assert.isNotOk(
                await master.canwipe.call(),
                'Cannot be wiped with running cekas',
            )

            await timeGap(26 * HOURS) // travel via 26 hours more

            // now it can be wiped
            assert.isOk(
                await cekae.finish.call(),
                'Should have one running ceka',
            )
            assert.isOk(
                await cekau.finish.call(),
                'Should have one running ceka',
            )
            assert.isOk(
                await master.canwipe.call(),
                'Cannot be wiped with running cekas',
            )
        })

        it('should wipe', async () => {
            // can't be wiped here
            assert.isOk(await master.canwipe.call(), 'Can be wiped at start')

            await master.create('s_u')

            await timeGap(100 * HOURS) // travel via 100 hours

            // now it can be wiped
            master.wipe.call()
            try {
                await CEKA.at((await master.get.call('s_u', true))[0])
                throw null
            } catch (error) {
                assert.isNotNull(error)
            }
        })
    })
})
