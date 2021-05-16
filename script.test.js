const board = require('./script')

it('input valid if not contained in either board array', () => {
    board.xArray = [1,2,3]
    board.oArray = [4,5,6]

    let outcome1 = board.inputValid('x', 7)
    expect(outcome1).toBe(true)
    let outcome2 = board.inputValid('o', 8)
    expect(outcome2).toBe(true)
})

it('input not valid if contained in either board array', () => {
    let i = 7, j = 8; 
    board.xArray = [1,2,3,i]
    board.oArray = [4,5,6,j]

    let outcome1 = board.inputValid('o', i)
    expect(outcome1).toBe(false)
    let outcome2 = board.inputValid('x', j)
    expect(outcome2).toBe(false)
})

it('rejects bad inputs', () => {
    let outcome1 = board.inputValid('foo', 0)
    expect(outcome1).toBe(false)
    let outcome2 = board.inputValid('x', 42)
    expect(outcome2).toBe(false)
    let outcome3 = board.inputValid('o', 0.99)
    expect(outcome3).toBe(false)
})

it('correctly determines player has won', () => {
    board.xArray = []
    board.oArray = []
    board.inputValid('o', 2)
    board.inputValid('o', 4)
    board.inputValid('o', 6)

    let outcome = board.win('o')
    expect(outcome).toBe(true)
})


