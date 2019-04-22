global = Object.assign(global, require('./helper'))

const FOBLL = artifacts.require('FOBLL')

contract('FOBLL', async accounts => {
    contract('Empty', async accounts => {
        it('should make new empty list', async () => {
            // intialize empty list
            let fobll = await FOBLL.new(0)

            // check list is empty
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

        it('should keep new empty list empty', async () => {
            // intialize empty list
            let fobll = await FOBLL.new(0)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 0)

            // push items to empty list
            let addr1 = rndAddr()
            await fobll.push(addr1, 1 * FINNEY)
            let addr2 = rndAddr()
            await fobll.push(addr2, 1 * FINNEY)
            let addr3 = rndAddr()
            await fobll.push(addr3, 1 * FINNEY)

            // check list is empty
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
    })

    contract('Single', async accounts => {
        it('should push single element to list', async () => {
            // intialize single item list
            let fobll = await FOBLL.new(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push single item to list
            let addr = rndAddr()
            await fobll.push(addr, 1 * FINNEY)

            // check list isn't empty
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 1)
            assert.equal(await fobll.capacity.call(), 1)

            assert.equal(await fobll.index.call(addr), 1)
            assert.equal(
                (await fobll.at.call(1)).toUpperCase(),
                addr.toUpperCase(),
            )

            let slice = await fobll.slice.call(1, 1)

            assert.lengthOf(slice, 1)
            assert.equal(slice[0].toUpperCase(), addr.toUpperCase())
        })

        it('should remove single element from list', async () => {
            // intialize single item list
            let fobll = await FOBLL.new(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push single item to list
            let addr = rndAddr()
            await fobll.push(addr, 1 * FINNEY)

            // check list isn't empty
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 1)
            assert.equal(await fobll.capacity.call(), 1)

            assert.equal(await fobll.index.call(addr), 1)

            // remove element by index
            await fobll.remove(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            assert.equal(await fobll.index.call(addr), 0)
        })

        it('should keep first single element into list', async () => {
            // intialize single item list
            let fobll = await FOBLL.new(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push items with same or smaller values
            let addr1 = rndAddr()
            await fobll.push(addr1, 2 * FINNEY)
            let addr2 = rndAddr()
            await fobll.push(addr2, 1 * FINNEY)
            let addr3 = rndAddr()
            await fobll.push(addr3, 2 * FINNEY)
            let addr4 = rndAddr()
            await fobll.push(addr4, 2 * FINNEY)
            let addr5 = rndAddr()
            await fobll.push(addr5, 1 * FINNEY)

            // check list isn't empty and has exactly first addr
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 1)
            assert.equal(await fobll.capacity.call(), 1)

            assert.equal(await fobll.index.call(addr1), 1)
            assert.equal(
                (await fobll.at.call(1)).toUpperCase(),
                addr1.toUpperCase(),
            )

            let slice = await fobll.slice.call(1, 1)

            assert.lengthOf(slice, 1)
            assert.equal(slice[0].toUpperCase(), addr1.toUpperCase())
        })

        it('should override first single element into list', async () => {
            // intialize single item list
            let fobll = await FOBLL.new(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push items with growing values
            let addr1 = rndAddr()
            await fobll.push(addr1, 1 * FINNEY)
            let addr2 = rndAddr()
            await fobll.push(addr2, 2 * FINNEY)
            let addr3 = rndAddr()
            await fobll.push(addr3, 3 * FINNEY)
            let addr4 = rndAddr()
            await fobll.push(addr4, 4 * FINNEY)
            let addr5 = rndAddr()
            await fobll.push(addr5, 5 * FINNEY)

            // check list isn't empty and has exactly last addr
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 1)
            assert.equal(await fobll.capacity.call(), 1)

            assert.equal(await fobll.index.call(addr5), 1)
            assert.equal(
                (await fobll.at.call(1)).toUpperCase(),
                addr5.toUpperCase(),
            )

            let slice = await fobll.slice.call(1, 1)

            assert.lengthOf(slice, 1)
            assert.equal(slice[0].toUpperCase(), addr5.toUpperCase())
        })

        it('should override same first single element into list', async () => {
            // intialize single item list
            let fobll = await FOBLL.new(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push items with growing values
            let addr1 = rndAddr()
            await fobll.push(addr1, 1 * FINNEY)
            let addr2 = rndAddr()
            await fobll.push(addr2, 2 * FINNEY)
            let addr3 = rndAddr()
            await fobll.push(addr3, 3 * FINNEY)
            // push exited element with growing values
            await fobll.push(addr2, 4 * FINNEY)
            await fobll.push(addr2, 5 * FINNEY)

            // check list isn't empty and has exactly last addr
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 1)
            assert.equal(await fobll.capacity.call(), 1)

            assert.equal(await fobll.index.call(addr2), 1)
            assert.equal(
                (await fobll.at.call(1)).toUpperCase(),
                addr2.toUpperCase(),
            )

            let slice = await fobll.slice.call(1, 1)

            assert.lengthOf(slice, 1)
            assert.equal(slice[0].toUpperCase(), addr2.toUpperCase())
        })

        it('should fail slice over capacity', async () => {
            // intialize single item list
            let fobll = await FOBLL.new(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push single item to list
            let addr = rndAddr()
            await fobll.push(addr, 1 * FINNEY)

            // check list isn't empty
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 1)
            assert.equal(await fobll.capacity.call(), 1)

            try {
                await fobll.slice.call(1, 2)
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
    })

    contract('Many', async accounts => {
        it('should push 3 elements to list in desc order', async () => {
            // intialize single item list
            let fobll = await FOBLL.new(3)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 3)

            // push 3 elements to list in desc order
            let addr1 = rndAddr()
            await fobll.push(addr1, 1 * FINNEY)
            let addr2 = rndAddr()
            await fobll.push(addr2, 2 * FINNEY)
            let addr3 = rndAddr()
            await fobll.push(addr3, 3 * FINNEY)

            // check list isn't empty and all elements were placed correctly
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 3)
            assert.equal(await fobll.capacity.call(), 3)

            assert.equal(await fobll.index.call(addr1), 3)
            assert.equal(await fobll.index.call(addr2), 2)
            assert.equal(await fobll.index.call(addr3), 1)

            assert.equal(
                (await fobll.at.call(3)).toUpperCase(),
                addr1.toUpperCase(),
            )
            assert.equal(
                (await fobll.at.call(2)).toUpperCase(),
                addr2.toUpperCase(),
            )
            assert.equal(
                (await fobll.at.call(1)).toUpperCase(),
                addr3.toUpperCase(),
            )

            let slice = await fobll.slice.call(1, 3)

            assert.lengthOf(slice, 3)
            assert.equal(slice[0].toUpperCase(), addr3.toUpperCase())
            assert.equal(slice[1].toUpperCase(), addr2.toUpperCase())
            assert.equal(slice[2].toUpperCase(), addr1.toUpperCase())
        })
    })
})
