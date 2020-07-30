const assert = require('assert');
const markupRemover = require('../src/markupRemover')
const markupParser = require('../src/markupParser')
const markupInvalidError = require('../src/markupInvalidError')
const App = require('../src/App')
const fs = require('fs')

describe('Unit tests', () => {

    describe('MarkupParser', () => {
        describe('#isMarkupParseable()', () => {
            it('should return true', () => {
                let mp = new markupParser('<b>asd</b>')

                assert.strictEqual(mp.isMarkupParseable(), true)
            })
            it('should return true', () => {
                let mp = new markupParser('<b><i>asd</b></i>')

                assert.strictEqual(mp.isMarkupParseable(), true)
            })
            it('should return false', () => {
                let mp = new markupParser('<b>asd<<b>')

                assert.strictEqual(mp.isMarkupParseable(), false)
            })
            it('should return false', () => {
                let mp = new markupParser('<b>B</b>ruh <b>B</b>ruh <<b>')

                assert.strictEqual(mp.isMarkupParseable(), false)
            })
            it('should return false', () => {
                let mp = new markupParser('<b>B</b>ruh <b>B</b>ruh <b>>')

                assert.strictEqual(mp.isMarkupParseable(), false)
            })
        })

        describe('#isMarkupPresent()', () => {
            it('should return true', () => {
                let mp = new markupParser('asd<b')

                assert.strictEqual(mp.isMarkupPresent(), true)
            })
            it('should return true', () => {
                let mp = new markupParser('>asd')

                assert.strictEqual(mp.isMarkupPresent(), true)
            })
            it('should return true', () => {
                let mp = new markupParser('<b>B</b>')

                assert.strictEqual(mp.isMarkupPresent(), true)
            })
            it('should return false', () => {
                let mp = new markupParser('asd');

                assert.strictEqual(mp.isMarkupPresent(), false)
            })
        })

        describe('#markupStartsWithCloseBracket()', () => {
            it('should return true', () => {
                let mp = new markupParser()
                mp.tagSplits = ['>', 'b>B', '/b>ruh']

                assert.strictEqual(mp.markupStartsWithCloseBracket(), true)
            })
            it('should return false', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'b>B', '/b>ruh']

                assert.strictEqual(mp.markupStartsWithCloseBracket(), false)
            })
            it('should return false', () => {
                let mp = new markupParser('asd<b>B<</b>ruh')
                mp.tagSplits = ['asd', 'b>B', '', '/b>ruh']

                assert.strictEqual(mp.markupStartsWithCloseBracket(), false)
            })
        })

        describe('#markupHasDuplicateOrNoCloseBrackets()', () => {
            it('should return true', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'b>B', '/b ruh']

                assert.strictEqual(mp.markupHasDuplicateOrNoCloseBrackets(), true)
            })
            it('should return true', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'b>B', '/b>ruh>', 'i>wut', '/i>']

                assert.strictEqual(mp.markupHasDuplicateOrNoCloseBrackets(), true)
            })
            it('should return false', () => {
                let mp = new markupParser()
                mp.tagSplits = ['<', 'b>B', '/b>ruh', 'i>wut', '/i>']
            
                assert.strictEqual(mp.markupHasDuplicateOrNoCloseBrackets(), false)
            })
            it('should return false', () => {
                let mp = new markupParser()
                mp.tagSplits = ['bsdfh', 'b>B', '/b>ruh', 'i>wut', '/i>']
            
                assert.strictEqual(mp.markupHasDuplicateOrNoCloseBrackets(), false)
            })
        })

        describe('#tagHasNoClosingBracket(index)', () => {
            it('should return true', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'b>B', '/b ruh']

                assert.strictEqual(mp.tagHasNoClosingBracket(2), true)
            })  
            it('should return false', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'bruh>']

                assert.strictEqual(mp.tagHasNoClosingBracket(1), false)
            })
        })

        describe('#tagHasDuplicateClosingBrackets(index)', () => {
            it('should return true', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'bruh>>']

                assert.strictEqual(mp.tagHasDuplicateClosingBrackets(1), true)
            })
            it('should return true', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', '>>bruh>>']

                assert.strictEqual(mp.tagHasDuplicateClosingBrackets(1), true)
            })
            it('should return false', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'bruh>']

                assert.strictEqual(mp.tagHasDuplicateClosingBrackets(1), false)
            })
            it('should return false', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'bruh']

                assert.strictEqual(mp.tagHasDuplicateClosingBrackets(1), false)
            })
        })

        describe('#invalidMarkupIndex', () => {
            it('should be equal -1', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'b>B', '/b>ruh']
                mp.markupStartsWithCloseBracket()

                assert.strictEqual(mp.invalidMarkupIndex, -1)
            })
            it('should be equal 3', () => {
                let mp = new markupParser()
                mp.tagSplits = ['asd>', 'b>B', '/b>ruh']
                mp.markupStartsWithCloseBracket()

                assert.strictEqual(mp.invalidMarkupIndex, 3)
            })
            it('should be equal -1', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'b>B', '/b>ruh']
                mp.markupHasDuplicateOrNoCloseBrackets()

                assert.strictEqual(mp.invalidMarkupIndex, -1)
            })
            it('should be equal 3', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'b>>B', '/b>ruh']
                mp.markupHasDuplicateOrNoCloseBrackets()

                assert.strictEqual(mp.invalidMarkupIndex, 3)
            })
            it('should be equal 0', () => {
                let mp = new markupParser()
                mp.tagSplits = ['', 'bB', '/b>ruh']
                mp.markupHasDuplicateOrNoCloseBrackets()

                assert.strictEqual(mp.invalidMarkupIndex, 0)
            })
        })

        describe('#tagIndexInOriginalText(index)', () => {
            it('should return 4', () => {
                let mp = new markupParser() 
                mp.tagSplits = ['', 'b>B', '/b>ruh']

                assert.strictEqual(mp.tagIndexInOriginalText(2), 4)
            })
            it('should return 0', () => {
                let mp = new markupParser() 
                mp.tagSplits = ['', 'b>B', '/b>ruh']

                assert.strictEqual(mp.tagIndexInOriginalText(1), 0)
            })
        })

        describe('getErrorLocation()', () => {
            it('should return {line 1, char 4}', () => {
                let mp = new markupParser('<b>>')
                mp.invalidMarkupIndex = 3

                assert.deepStrictEqual(
                    mp.getErrorLocation(), {line: 1, character: 4}
                )
            })
            it('should return {line 1, char 4}', () => {
                let mp = new markupParser('<br><<b>')
                mp.invalidMarkupIndex = 4

                assert.deepStrictEqual(
                    mp.getErrorLocation(), {line: 1, character: 5}
                )
            })
            it('should return {line 2, char 0}', () => {
                let mp = new markupParser('<b>\n')
                mp.invalidMarkupIndex = 3

                assert.deepStrictEqual(
                    mp.getErrorLocation(), {line: 2, character: 0}
                )
            })
            it('should return {line 2, char 1}', () => {
                let mp = new markupParser('<br>\n<<b>')
                mp.invalidMarkupIndex = 5

                assert.deepStrictEqual(
                    mp.getErrorLocation(), {line: 2, character: 1}
                )
            })
        })
    })


    describe('MarkupRemover', () => {
        describe('#isMarkupPresentAndParseable()', () => {
            it('should return true', () => {
                let mr = new markupRemover('asdd<b>adfbs');

                assert.strictEqual(
                    mr.isMarkupPresentAndParseable(), true
                )
            })
            it('should return true', () => {
                let mr = new markupRemover(
`<asddadfbs>
<>asddsdsdsd<>
asdsd<>`
                );

                assert.strictEqual(
                    mr.isMarkupPresentAndParseable(), true
                )
            })
            it('should return false', () => {
                let mr = new markupRemover();
                mr.originalText = ''

                assert.strictEqual(
                    mr.isMarkupPresentAndParseable(), false
                )
            })
            it('should return false', () => {
                let mr = new markupRemover();
                mr.originalText = 'asdd<badfbs'

                assert.strictEqual(
                    mr.isMarkupPresentAndParseable(), false
                )
            })
            it('should return false', () => {
                let mr = new markupRemover();
                mr.originalText = 'asdav'

                assert.strictEqual(
                    mr.isMarkupPresentAndParseable(), false
                )
            })
        })

        describe('#findClosestMarkupIndices()', () => {
            it('should set openBracketIndex to 3', () => {
                let mr = new markupRemover();
                mr.buffer = '012<'
                mr.findClosestMarkupIndices()

                assert.strictEqual(
                    mr.openBracketIndex, 3
                )
            })
            it('should set closeBracketIndex to -1', () => {
                let mr = new markupRemover();
                mr.buffer = '012<'
                mr.findClosestMarkupIndices()

                assert.strictEqual(
                    mr.closeBracketIndex, -1
                )
            })
            it('should set openBracketIndex to 3', () => {
                let mr = new markupRemover();
                mr.buffer = '012<>'
                mr.findClosestMarkupIndices()

                assert.strictEqual(
                    mr.openBracketIndex, 3
                )
            })
            it('should set closeBracketIndex to 4', () => {
                let mr = new markupRemover();
                mr.buffer = '012<>'
                mr.findClosestMarkupIndices()

                assert.strictEqual(
                    mr.closeBracketIndex, 4
                )
            })
        })

        describe('#removeClosestMarkup()', () => {
            it('should set buffer to "Bruh"', () => {
                let mr = new markupRemover('<b>Bruh', '');
                mr.openBracketIndex = 0
                mr.closeBracketIndex = 2
                mr.removeClosestMarkup()
                
                assert.strictEqual(mr.buffer, 'Bruh')
            })
            it('should set buffer to "Bruh Bruh"', () => {
                let mr = new markupRemover('Bruh <b>Bruh', '');
                mr.openBracketIndex = 5
                mr.closeBracketIndex = 7
                mr.removeClosestMarkup()
                
                assert.strictEqual(mr.buffer, 'Bruh Bruh')
            })
            it('should set buffer to "Bruh"', () => {
                let mr = new markupRemover('<b>Bruh', 'asd');
                mr.openBracketIndex = 0
                mr.closeBracketIndex = 2
                mr.removeClosestMarkup()
                
                assert.strictEqual(mr.buffer, 'Bruh')
            })
            it('should set buffer to "Bruh asd Bruh"', () => {
                let mr = new markupRemover('Bruh <b>Bruh', 'asd ');
                mr.openBracketIndex = 5
                mr.closeBracketIndex = 7
                mr.removeClosestMarkup()
                
                assert.strictEqual(mr.buffer, 'Bruh asd Bruh')
            })
            it('should set buffer to "Bruh"', () => {
                let mr = new markupRemover('Bruh', '');
                mr.openBracketIndex = -1
                mr.closeBracketIndex = -1
                mr.removeClosestMarkup()
                
                assert.strictEqual(mr.buffer, 'Bruh')
            })
        })

        describe('#closestMarkupFound()', () => {
            it('should return true', () => {
                let mr = new markupRemover()
                mr.openBracketIndex = 0
                mr.closeBracketIndex = 0

                assert.strictEqual(mr.closestMarkupFound(), true)
            })
            it('should return false', () => {
                let mr = new markupRemover()
                mr.openBracketIndex = -1
                mr.closeBracketIndex = 0

                assert.strictEqual(mr.closestMarkupFound(), false)
            })
            it('should return true', () => {
                let mr = new markupRemover()
                mr.openBracketIndex = 0
                mr.closeBracketIndex = -1

                assert.strictEqual(mr.closestMarkupFound(), false)
            })
            it('should return true', () => {
                let mr = new markupRemover()
                mr.openBracketIndex = -1
                mr.closeBracketIndex = -1

                assert.strictEqual(mr.closestMarkupFound(), false)
            })
        })

        describe('#reportMarkupValidationError()', () => {
            it('should throw "The markup is invalid", line 1, char 1',() => {
                let mr = new markupRemover()
                let pos = {line: 1, character: 1}

                try {
                    mr.reportMarkupValidationError(pos)
                }
                catch(e) {
                    assert.deepStrictEqual(e, new markupInvalidError('The markup is invalid', 1, 1))
                }
            })

            it('should throw "The markup is invalid", line 4, char 12',() => {
                let mr = new markupRemover()
                let pos = {line: 4, character: 12}

                try {
                    mr.reportMarkupValidationError(pos)
                }
                catch(e) {
                    assert.deepStrictEqual(e, new markupInvalidError('The markup is invalid', 4, 12))
                }
            })
        })
    })

    describe('App', () => {
        before(() => {
            this.inputFilePath = '/Users/odmen/test.txt'
            this.outputFilePath = '/Users/odmen/out_test.txt'
            this.app = new App()
        })  

        describe('#readFile()', () => {
            before(done => {
                fs.writeFile(this.inputFilePath, 'asd', err => {
                    if(err)
                        throw err
                    done()
                })
            })

            it('should read asd', done => {
                this.app.readFile(this.inputFilePath).then(res => {
                    assert.strictEqual(res, 'asd')
                    done()
                })
            })

            after(done => {
                fs.unlink(this.inputFilePath, err => {
                    if(err)
                        throw err
                    done()
                })
            })
        })
        
        describe('#writeResults()', () => {
            before(() => {
                this.outText = 'asd'
                this.app.markupLessText = this.outText
            })

            it('should write asd out', done => {
                this.app.writeResults(this.outputFilePath).then(() => {
                    fs.readFile(this.outputFilePath, (err, data) => {
                        if(err)
                            throw err
                        assert.strictEqual(data.toString(), this.outText)
                        done()
                    })
                })
            })

            after(done => {
                fs.unlink(this.outputFilePath, err => {
                    if(err)
                        throw err
                    done()
                })
            })
        })
    })
    
})

