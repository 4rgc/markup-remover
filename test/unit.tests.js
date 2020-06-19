const assert = require('assert');
const markupRemover = require('../src/index')

describe('Unit tests', () => {
    describe('#isMarkupPresent()', () => {
        it('should return true', () => {
            markupRemover.buffer = '<'

            assert.strictEqual(markupRemover.isMarkupPresent(), true)
        })
        it('should return true', () => {
            markupRemover.buffer = '>'

            assert.strictEqual(markupRemover.isMarkupPresent(), true)
        })
        it('should return true', () => {
            markupRemover.buffer = '<b>bruh</b>'

            assert.strictEqual(markupRemover.isMarkupPresent(), true)
        })
        it('should return false', () => {
            markupRemover.buffer = 'bruh'

            assert.strictEqual(markupRemover.isMarkupPresent(), false)
        })
    })  

    describe('#findClosestMarkupIndices()', () => {
        it('should set openBracketIndex to 3', () => {
            markupRemover.buffer = '012<'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(markupRemover.openBracketIndex, 3)
        })
        it('should set closeBracketIndex to -1', () => {
            markupRemover.buffer = '012<'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(markupRemover.closeBracketIndex, -1)
        })
        it('should set openBracketIndex to 3', () => {
            markupRemover.buffer = '012<>'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(markupRemover.openBracketIndex, 3)
        })
        it('should set closeBracketIndex to 4', () => {
            markupRemover.buffer = '012<>'
            markupRemover.findClosestMarkupIndices()

            assert.strictEqual(markupRemover.closeBracketIndex, 4)
        })
    })

    describe('#isMarkupValid()', () => {
        it('should return true', () => {
            markupRemover.buffer = '<b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(markupRemover.isMarkupValid(), true)
        })
        it('should return true', () => {
            markupRemover.buffer = '<b>B</b>ruh bruhbruh br<b>uh</b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(markupRemover.isMarkupValid(), true)
        })
        it('should return false', () => {
            markupRemover.buffer = '<<b>'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 3

            assert.strictEqual(markupRemover.isMarkupValid(), false)
        })
        it('should return false', () => {
            markupRemover.buffer = 'b>'
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 1

            assert.strictEqual(markupRemover.isMarkupValid(), false)
        })
        it('should return false', () => {
            markupRemover.buffer = '<b'
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(markupRemover.isMarkupValid(), false)
        })
        it('should return false', () => {
            markupRemover.buffer = 'b> <i>asgadf</i>'
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 1
            
            assert.strictEqual(markupRemover.isMarkupValid(), false)
        })
    })

    describe('#isOneBracketMissing()', () => {
        it('should return false', () => {
            markupRemover.openBracketIndex = 0
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(markupRemover.isOneBracketMissing(), false)
        })
        it('should return false', () => {
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(markupRemover.isOneBracketMissing(), false)
        })
        it('should return true', () => {
            markupRemover.openBracketIndex = -1
            markupRemover.closeBracketIndex = 2

            assert.strictEqual(markupRemover.isOneBracketMissing(), true)
        })
        it('should return true', () => {
            markupRemover.openBracketIndex = 1
            markupRemover.closeBracketIndex = -1

            assert.strictEqual(markupRemover.isOneBracketMissing(), true)
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

