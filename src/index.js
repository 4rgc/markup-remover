const markupInvalidError = require('./markupInvalidError')

class MarkupRemover {
    static openBracketIndex = 0
    static closeBracketIndex = 0
    static originalText = ''
    static buffer = ''
    static errorIndex = 0
    
    static removeMarkup(markedText, splitter = '') {
        this.originalText = markedText
        this.buffer = markedText
        while(this.isMarkupPresentAndValid()) {
            this.removeClosestMarkup(splitter)
        }
        return this.buffer
    }

    static isMarkupPresentAndValid() {
        this.findClosestMarkupIndices()
        if(!this.isMarkupPresent())
            return false
        if(!this.isMarkupValid()) {
            let errorLocation = this.countLinesAndCharacters()
                throw new markupInvalidError('The markup is invalid', errorLocation.line, errorLocation.character)
        }
        return true
    }

    static findClosestMarkupIndices() {
        this.openBracketIndex = this.buffer.indexOf('<')
        this.closeBracketIndex = this.buffer.indexOf('>')
    }

    static isMarkupPresent() {
        return this.isOpenBracketFound() || this.isCloseBracketFound()
    }

    static isOpenBracketFound() {
        return this.openBracketIndex != -1
    }

    static isCloseBracketFound() {
        return this.closeBracketIndex != -1
    }

    static isMarkupValid() {
        if(this.isOneBracketMissing()) {
            this.errorIndex = this.oneBracketMissingErrorIndex()
            return false
        }
        if(this.startsWithCloseBracket()) {
            this.errorIndex = MarkupRemover.startsWithCloseBracketErrorIndex()
            return false
        }
        if(this.containsDoubleBrackets()) {
            this.errorIndex = MarkupRemover.doubleBracketsErrorIndex()
            return false
        }
        return true   
    }

    static isOneBracketMissing() {
        if( (this.isOpenBracketFound() && !this.isCloseBracketFound()) || 
            (!this.isOpenBracketFound() && this.isCloseBracketFound()) )
            return true
        return false
    }

    static oneBracketMissingErrorIndex() {
        if (!this.isOpenBracketFound()) {
            return this.closeBracketIndex
        }
        else {
            return this.openBracketIndex
        }
    }

    static startsWithCloseBracket() {
        return this.closeBracketIndex < this.openBracketIndex
    }

    static startsWithCloseBracketErrorIndex() {
        return this.closeBracketIndex
    }

    static containsDoubleBrackets() {
        for(let i = this.openBracketIndex + 1; i < this.closeBracketIndex; i++) {
            if(this.buffer[i] == '<')
                return true
        }
        return false
    }

    static doubleBracketsErrorIndex() {
        return this.openBracketIndex
    }

    static countLinesAndCharacters() {
        let originalIndex = this.originalText.lastIndexOf(this.buffer.substring(this.errorIndex))
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

    static removeClosestMarkup(splitter) {
        let textBefore = this.buffer.substring(0, this.openBracketIndex)
        let textAfter = this.buffer.substring(this.closeBracketIndex + 1, this.buffer.length)
        if (textBefore == '')
            this.buffer = textAfter
        else if (textAfter == '')
            this.buffer = textBefore
        else
            this.buffer = textBefore + splitter + textAfter
    }
}

module.exports = MarkupRemover