const assert = require('assert');
const markupRemover = require('../src/index')
const markupInvalidError = require('../src/markupInvalidError')

describe('Error tests', () => {
    it('should throw "The markup is invalid", line 1, char 8', () => {
        try {
            markupRemover.removeMarkup('asdasdb>text</b>','')
        }
        catch(e) {
            assert.deepEqual(e, new markupInvalidError('The markup is invalid', 1, 8))
        }
    })
    it('should throw "The markup is invalid", line 1, char 1', () => {
        try {
            markupRemover.removeMarkup('<btext</b>','')
        }
        catch(e) {
            assert.deepEqual(e, new markupInvalidError('The markup is invalid', 1, 1))
        }
    })
    it('should throw "The markup is invalid", line 1, char 5', () => {
        try {
            markupRemover.removeMarkup('asda<<b>', '')
        }
        catch(e) {
            assert.deepEqual(e, new markupInvalidError('The markup is invalid', 1, 5))
        }
    })
    it('should throw "The markup is invalid", line 1, char 28', () => {
        try {
            markupRemover.removeMarkup('<b>B</b>ruh <b>B</b>ruh <b>>', '')
        }
        catch(e) {
            assert.deepEqual(e, new markupInvalidError('The markup is invalid', 1, 28))
        }
    })
    it('should throw "The markup is invalid", line 1, char 25', () => {
        try {
            markupRemover.removeMarkup('<b>B</b>ruh <b>B</b>ruh <<b>', '')
        }
        catch(e) {
            assert.deepEqual(e, new markupInvalidError('The markup is invalid', 1, 25))
        }
    })
})
