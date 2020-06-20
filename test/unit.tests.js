const assert = require('assert');
const markupRemover = require('../src/index')

describe('Unit tests', () => {
    describe('#isMarkupPresentAndValid()', () => {
        it('should return true', () => {
            markupRemover.buffer = 'asdd<b>adfbs'

            assert.strictEqual(
                markupRemover.isMarkupPresentAndValid(), true
            )
        })
        it('should return true', () => {
            markupRemover.buffer = 
`<asddadfbs>
<>asddsdsdsd<>
asdsd<>`

            assert.strictEqual(
                markupRemover.isMarkupPresentAndValid(), true
            )
        })
        it('should return false', () => {
            markupRemover.buffer = ''

            assert.strictEqual(
                markupRemover.isMarkupPresentAndValid(), false
            )
        })
        it('should return false', () => {
            markupRemover.buffer = 'asdav'

            assert.strictEqual(
                markupRemover.isMarkupPresentAndValid(), false
            )
        })
    })

    describe('#isMarkupPresent()', () => {
        it('should return true', () => {
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(
                markupRemover.isMarkupPresent(), true
            )
        })
        it('should return true', () => {
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 0

            assert.strictEqual(
                markupRemover.isMarkupPresent(), true
            )
        })
        it('should return true', () => {
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(
                markupRemover.isMarkupPresent(), true
            )
        })
        it('should return false', () => {
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(
                markupRemover.isMarkupPresent(), false
            )
        })
    })  

    describe('#findClosestMarkupIndices()', () => {
        it('should set openBracketIndex to 3', () => {
            markupRemover.buffer = '012<'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(
                markupRemover.openBracketIndex, 3
            )
        })
        it('should set closeBracketIndex to -1', () => {
            markupRemover.buffer = '012<'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(
                markupRemover.closeBracketIndex, -1
            )
        })
        it('should set openBracketIndex to 3', () => {
            markupRemover.buffer = '012<>'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(
                markupRemover.openBracketIndex, 3
            )
        })
        it('should set closeBracketIndex to 4', () => {
            markupRemover.buffer = '012<>'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(
                markupRemover.closeBracketIndex, 4
            )
        })
    })

    describe('#isMarkupValid()', () => {
        it('should return true', () => {
            markupRemover.buffer = '<b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(
                markupRemover.isMarkupValid(), true
            )
        })
        it('should return true', () => {
            markupRemover.buffer = '<b>B</b>ruh bruhbruh br<b>uh</b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(
                markupRemover.isMarkupValid(), true
            )
        })
        it('should return false', () => {
            markupRemover.buffer = '<<b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 3

            assert.strictEqual(
                markupRemover.isMarkupValid(), false
            )
        })
        it('should return false', () => {
            markupRemover.buffer = 'b>'
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 1

            assert.strictEqual(
                markupRemover.isMarkupValid(), false
            )
        })
        it('should return false', () => {
            markupRemover.buffer = '<b'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(
                markupRemover.isMarkupValid(), false
            )
        })
        it('should return false', () => {
            markupRemover.buffer = 'b> <i>asgadf</i>'
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 1
            
            assert.strictEqual(
                markupRemover.isMarkupValid(), false
            )
        })
    })

    describe('#isOneBracketMissing()', () => {
        it('should return false', () => {
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(
                markupRemover.isOneBracketMissing(), false
            )
        })
        it('should return false', () => {
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(
                markupRemover.isOneBracketMissing(), false
            )
        })
        it('should return true', () => {
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(
                markupRemover.isOneBracketMissing(), true
            )
        })
        it('should return true', () => {
            markupRemover.openBracketIndex = 1
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(
                markupRemover.isOneBracketMissing(), true
            )
        })
    })

    describe('#oneBracketMissingErrorIndex()', () => {
        it('should return 2', () => {
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 2
            
            assert.strictEqual(
                markupRemover.oneBracketMissingErrorIndex(), 2
            )
        })
        it('should return 0', () => {
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = -1
            
            assert.strictEqual(
                markupRemover.oneBracketMissingErrorIndex(), 0
            )
        })
    })

    describe('#containsDoubleBrackets()', () => {
        it('should return true', () => {
            markupRemover.buffer = '<<b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 3

            assert.strictEqual(
                markupRemover.containsDoubleBrackets(), true
            )
        })
        it('should return false', () => {
            markupRemover.buffer = '<b><i></i></b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(
                markupRemover.containsDoubleBrackets(), false
            )
        })
    })

    describe('#countLinesAndCharacters()', () => {
        it('should return {line 1, char 4}', () => {
            markupRemover.originalText = '<b>>'
            markupRemover.buffer = '>'
            markupRemover.errorIndex = 0

            assert.deepStrictEqual(
                markupRemover.countLinesAndCharacters(), {line: 1, character: 4}
            )
        })
        it('should return {line 1, char 5}', () => {
            markupRemover.originalText = '<br><<b>'
            markupRemover.buffer = 'asd<<b>'
            markupRemover.errorIndex = 3

            assert.deepStrictEqual(
                markupRemover.countLinesAndCharacters(), {line: 1, character: 5}
            )
        })
    })

    describe('#removeClosestMarkup()', () => {
        it('should set buffer to "Bruh"', () => {
            markupRemover.buffer = '<b>Bruh'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2
            markupRemover.removeClosestMarkup('')
            
            assert.strictEqual(markupRemover.buffer, 'Bruh')
        })
        it('should set buffer to "Bruh Bruh"', () => {
            markupRemover.buffer = 'Bruh <b>Bruh'
            markupRemover.openBracketIndex = 5
            markupRemover.closeBracketIndex = 7
            markupRemover.removeClosestMarkup('')
            
            assert.strictEqual(markupRemover.buffer, 'Bruh Bruh')
        })
        it('should set buffer to "Bruh"', () => {
            markupRemover.buffer = '<b>Bruh'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2
            markupRemover.removeClosestMarkup('asd')
            
            assert.strictEqual(markupRemover.buffer, 'Bruh')
        })
        it('should set buffer to "Bruh asd Bruh"', () => {
            markupRemover.buffer = 'Bruh <b>Bruh'
            markupRemover.openBracketIndex = 5
            markupRemover.closeBracketIndex = 7
            markupRemover.removeClosestMarkup('asd ')
            
            assert.strictEqual(markupRemover.buffer, 'Bruh asd Bruh')
        })
    })
})

