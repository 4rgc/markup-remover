const assert = require('assert');
const markupRemover = require('../src/index')

describe('Error tests', () => {
    it('should throw "The markup is not valid"', () => {
        try {
            markupRemover.removeMarkup('b>text</b>','')
        }
        catch(e) {
            assert.equal(e, 'The markup is invalid')
        }
    })
    it('should throw "The markup is not valid"', () => {
        try {
            markupRemover.removeMarkup('b>text</b>','')
        }
        catch(e) {
            assert.equal(e, 'The markup is invalid')
        }
    })
})
