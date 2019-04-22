global = Object.assign(global, require('./helper'))

const FOBLL = artifacts.require('FOBLL')

contract('FOBLL', async accounts => {
    it('should initalize new empty list', async () => {
        let fobll = await FOBLL.new(0)

        assert.isOk(await fobll.empty.call())
        assert.equal(await fobll.size.call(), 0)
        assert.equal(await fobll.capacity.call(), 0)

        try {
            await fobll.slice.call(1, 1)
            throw null
        } catch (error) {
            assert.isNotNull(error, 'Expected name error')
            assert.include(
                error.message,
                'Invalid indexes specified',
                'Expected name error',
            )
        }
    })

    it('should push single element to list', async () => {
        let fobll = await FOBLL.new(1)

        assert.isOk(await fobll.empty.call())
        assert.equal(await fobll.size.call(), 0)
        assert.equal(await fobll.capacity.call(), 1)

        let addr = rndAddr()
        await fobll.push(addr, 1 * FINNEY)

        assert.equal(await fobll.size.call(), 1)
        assert.equal(await fobll.capacity.call(), 1)

        assert.equal(await fobll.index.call(addr), 1)
        assert.equal((await fobll.at.call(1)).toUpperCase(), addr.toUpperCase())

        let slice = await fobll.slice.call(1, 1)

        assert.lengthOf(slice, 1)
        assert.equal(slice[0].toUpperCase(), addr.toUpperCase())
    })
})
