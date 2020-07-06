const markupInvalidError = require('./markupInvalidError')
const markupParser = require('./markupParser')

class MarkupRemover {
    mp = null
    openBracketIndex = 0
    closeBracketIndex = 0
    originalText = ''
    buffer = ''
    splitter = ''

    constructor(markedText = '', splitter = '') {
        this.originalText = markedText
        this.mp = new markupParser(markedText)
        this.buffer = markedText
        this.splitter = splitter
    }
    
    removeMarkup() {
        if(this.isMarkupPresentAndParseable()) {
            do {
                this.findClosestMarkupIndices()
                this.removeClosestMarkup()
            } while(this.closestMarkupFound())
        }
        else {
            let position = this.countLinesAndCharacters(this.mp.invalidMarkupIndex)
            throw new markupInvalidError('The markup is invalid', position.line, position.character)
        }
        return this.buffer
    }

    isMarkupPresentAndParseable() {
        return this.mp.isMarkupPresent() && this.mp.isMarkupParseable()
    }

    findClosestMarkupIndices() {
        this.openBracketIndex = this.buffer.indexOf('<')
        this.closeBracketIndex = this.buffer.indexOf('>')
    }

    removeClosestMarkup() {
        let textBefore = this.buffer.substring(0, this.openBracketIndex)
        let textAfter = this.buffer.substring(this.closeBracketIndex + 1, this.buffer.length)
        if (textBefore == '')
            this.buffer = textAfter
        else if (textAfter == '')
            this.buffer = textBefore
        else
            this.buffer = textBefore + this.splitter + textAfter
    }

    closestMarkupFound() {
        return this.openBracketIndex != -1 && this.closeBracketIndex != -1
    }
    
    countLinesAndCharacters(errorIndex) {
        let originalIndex = this.originalText.lastIndexOf(this.buffer.substring(errorIndex))
        let lineBreakCount = 0
        let characterInLineCount = 0
        for(let i = 0; i < originalIndex; i++) {
            characterInLineCount++
            if(this.originalText[i] == '\n') { 
                lineBreakCount++
                characterInLineCount = 0
            }
        }
        return {line: lineBreakCount + 1, character: characterInLineCount + 1}
    }
}

module.exports = MarkupRemover