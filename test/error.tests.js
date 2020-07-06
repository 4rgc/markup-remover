const assert = require('assert');
const markupRemover = require('../src/markupRemover')
const markupInvalidError = require('../src/markupInvalidError')

describe('Error tests', () => {
    it('should throw "The markup is invalid", line 1, char 8', () => {
        try {
            let mr = new markupRemover('asdasdb>text</b>','')

            mr.removeMarkup()
        }
        catch(e) {
            assert.deepStrictEqual(e, new markupInvalidError('The markup is invalid', 1, 8))
        }
    })
    it('should throw "The markup is invalid", line 1, char 1', () => {
        try {
            let mr = new markupRemover('<btext</b>','')

            mr.removeMarkup()
        }
        catch(e) {
            assert.deepStrictEqual(e, new markupInvalidError('The markup is invalid', 1, 1))
        }
    })
    it('should throw "The markup is invalid", line 1, char 5', () => {
        try {
            let mr = new markupRemover('asda<<b>', '')
            
            mr.removeMarkup()
        }
        catch(e) {
            assert.deepStrictEqual(e, new markupInvalidError('The markup is invalid', 1, 5))
        }
    })
    it('should throw "The markup is invalid", line 1, char 28', () => {
        try {
            let mr = new markupRemover('<b>B</b>ruh <b>B</b>ruh <b>>', '')

            mr.removeMarkup()
        }
        catch(e) {
            assert.deepStrictEqual(e, new markupInvalidError('The markup is invalid', 1, 28))
        }
    })
    it('should throw "The markup is invalid", line 1, char 25', () => {
        try {
            let mr = new markupRemover('<b>B</b>ruh <b>B</b>ruh <<b>', '')

            mr.removeMarkup()
        }
        catch(e) {
            assert.deepStrictEqual(e, new markupInvalidError('The markup is invalid', 1, 25))
        }
    })
})
