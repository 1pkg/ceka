global = Object.assign(global, require('./helper'))

const FOBLL = artifacts.require('FOBLL')

contract('FOBLL', async accounts => {
    contract('Empty', async accounts => {
        let fobll = null
        beforeEach(async () => {
            // intialize empty list
            fobll = await FOBLL.new(0)
        })

        it('should make new empty list', async () => {
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
            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 0)

            // push elements to empty list
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
        let fobll = null
        beforeEach(async () => {
            // intialize single item list
            fobll = await FOBLL.new(1)
        })

        it('should push single element to list', async () => {
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
            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push elements with same or smaller values
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
            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push elements with growing values
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
            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 1)

            // push elements with growing values
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
        it('should push 3 elements to list then remove them', async () => {
            // intialize list
            let fobll = await FOBLL.new(3)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 3)

            // push 3 elements to list in desc order
            let addr1 = rndAddr()
            await fobll.push(addr1, 3 * FINNEY)
            let addr2 = rndAddr()
            await fobll.push(addr2, 3 * FINNEY)
            let addr3 = rndAddr()
            await fobll.push(addr3, 3 * FINNEY)

            // check list isn't empty and all elements were placed correctly
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 3)
            assert.equal(await fobll.capacity.call(), 3)

            assert.equal(await fobll.index.call(addr1), 1)
            assert.equal(await fobll.index.call(addr2), 2)
            assert.equal(await fobll.index.call(addr3), 3)

            // remove second element
            await fobll.remove(2)

            // check list isn't empty and all elements were placed correctly
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 2)
            assert.equal(await fobll.capacity.call(), 3)

            assert.equal(await fobll.index.call(addr1), 1)
            assert.equal(await fobll.index.call(addr2), 0)
            assert.equal(await fobll.index.call(addr3), 2)

            // remove first element
            await fobll.remove(1)

            // check list isn't empty and all elements were placed correctly
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 1)
            assert.equal(await fobll.capacity.call(), 3)

            assert.equal(await fobll.index.call(addr1), 0)
            assert.equal(await fobll.index.call(addr2), 0)
            assert.equal(await fobll.index.call(addr3), 1)

            // remove third element
            await fobll.remove(1)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 3)

            assert.equal(await fobll.index.call(addr1), 0)
            assert.equal(await fobll.index.call(addr2), 0)
            assert.equal(await fobll.index.call(addr3), 0)
        })

        it('should push 3 elements to list in desc order', async () => {
            // intialize list
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

        it('should push 7 elements to 5 elements list in rnd order', async () => {
            // intialize list
            let fobll = await FOBLL.new(5)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 5)

            // push 7 elements to list in rnd order
            let addr1 = rndAddr()
            await fobll.push(addr1, 3 * FINNEY)
            let addr2 = rndAddr()
            await fobll.push(addr2, 5 * FINNEY)
            let addr3 = rndAddr()
            await fobll.push(addr3, 2 * FINNEY)
            let addr4 = rndAddr()
            await fobll.push(addr4, 8 * FINNEY)
            let addr5 = rndAddr()
            await fobll.push(addr5, 1 * FINNEY)
            let addr6 = rndAddr()
            await fobll.push(addr6, 3 * FINNEY)
            let addr7 = rndAddr()
            await fobll.push(addr7, 4 * FINNEY)

            // check list isn't empty and all elements were placed correctly
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 5)
            assert.equal(await fobll.capacity.call(), 5)

            assert.equal(await fobll.index.call(addr1), 4)
            assert.equal(await fobll.index.call(addr2), 2)
            assert.equal(await fobll.index.call(addr3), 0)
            assert.equal(await fobll.index.call(addr4), 1)
            assert.equal(await fobll.index.call(addr5), 0)
            assert.equal(await fobll.index.call(addr6), 5)
            assert.equal(await fobll.index.call(addr7), 3)

            let slice = await fobll.slice.call(1, 5)
            assert.lengthOf(slice, 5)
            assert.equal(slice[0].toUpperCase(), addr4.toUpperCase())
            assert.equal(slice[1].toUpperCase(), addr2.toUpperCase())
            assert.equal(slice[2].toUpperCase(), addr7.toUpperCase())
            assert.equal(slice[3].toUpperCase(), addr1.toUpperCase())
            assert.equal(slice[4].toUpperCase(), addr6.toUpperCase())
        })

        it('should push many elements to list', async () => {
            // intialize list
            let fobll = await FOBLL.new(100)

            // check list is empty
            assert.isOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 0)
            assert.equal(await fobll.capacity.call(), 100)

            // push 1000 elements to list in rnd order
            // keep tracking in members list
            let members = []
            for (let i = 0; i < 1000; ++i) {
                if (i % 2 == 0) {
                    let addr = rndAddr()
                    let value = (Math.floor(Math.random() * 100) + 1) * SZABO
                    await fobll.push(addr, value)
                    members.push({ addr, value, i })
                } else {
                    let index = Math.floor(Math.random() * members.length)
                    let addValue = (Math.floor(Math.random() * 15) + 1) * SZABO
                    members[index].value += addValue
                    members[index].i = i
                    await fobll.push(members[index].addr, members[index].value)
                }

                // print % of execution
                if (i % 100 == 0) {
                    console.log((i / 1000) * 100 + '%')
                }
            }
            // stable sort
            members.sort((first, second) => {
                if (second.value == first.value) {
                    return first.i - second.i
                }
                return second.value - first.value
            })
            members = members.slice(0, 100)

            // check list isn't empty and all elements were placed correctly
            assert.isNotOk(await fobll.empty.call())
            assert.equal(await fobll.size.call(), 100)
            assert.equal(await fobll.capacity.call(), 100)

            for (let i = 0; i < 100; ++i) {
                let member = members[i]
                assert.equal(await fobll.index.call(member.addr), i + 1)
                assert.equal(
                    (await fobll.at.call(i + 1)).toUpperCase(),
                    member.addr.toUpperCase(),
                )
            }

            let slice = await fobll.slice.call(1, 100)
            assert.lengthOf(slice, 100)
            assert.deepEqual(
                slice.map(member => member.toUpperCase()),
                members.map(member => member.addr.toUpperCase()),
            )
        })
    })
})
