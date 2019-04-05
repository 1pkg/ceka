const Master = artifacts.require('Master')
const CEKA = artifacts.require('CEKA')

const SZABO = 1e12
const FINNEY = 1e15
const ETHER = 1e18

const MINUTES = 60
const HOURS = 60 * MINUTES

contract('Fabric', async accounts => {
    it('should create small usual ceka', async () => {
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('s_u')
        let addr = await master.get.call('s_u', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('s_e')
        let addr = await master.get.call('s_e', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('n_s')
        let addr = await master.get.call('n_s', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('n_u')
        let addr = await master.get.call('n_u', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('n_c')
        let addr = await master.get.call('n_c', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('n_l')
        let addr = await master.get.call('n_l', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('n_e')
        let addr = await master.get.call('n_e', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('l_u')
        let addr = await master.get.call('l_u', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('l_c')
        let addr = await master.get.call('l_c', true)
        let ceka = await CEKA.at(addr[0])

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
        let master = await Master.new()
        await master.send(1 * ETHER)
        await master.create('l_e')
        let addr = await master.get.call('l_e', true)
        let ceka = await CEKA.at(addr[0])

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
})
