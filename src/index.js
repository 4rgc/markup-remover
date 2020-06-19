class MarkupRemover {
    static openBracketIndex = 0
    static closeBracketIndex = 0
    static buffer = ''
    static removeMarkup(markedText, splitter = '') {
        this.buffer = markedText
        while(this.isMarkupPresent()) {
            this.findClosestMarkupIndices()
            if(!this.isMarkupValid())
                throw 'The markup is invalid'
            this.removeClosestMarkup(splitter)
        }
        return this.buffer
    }

    static isMarkupPresent() {
        return this.buffer.indexOf('<') != -1 || this.buffer.indexOf('>') != -1
    }

    static findClosestMarkupIndices() {
        this.openBracketIndex = this.buffer.indexOf('<')
        this.closeBracketIndex = this.buffer.indexOf('>')
    }

    static isMarkupValid() {
        if(this.isOneBracketMissing())
            return false
        if(this.closeBracketIndex < this.openBracketIndex)
            return false
        if(this.containsBracketsInBrackets())
            return false
        return true;    
    }

    static isOneBracketMissing() {
        return (this.isOpenBracketFound() && !this.isCloseBracketFound()) ||
            (!this.isOpenBracketFound() && this.isCloseBracketFound())
    }

    static isCloseBracketFound() {
        return this.closeBracketIndex != -1
    }

    static isOpenBracketFound() {
        return this.openBracketIndex != -1
    }

    static containsBracketsInBrackets() {
        for(let i = this.openBracketIndex + 1; i < this.closeBracketIndex; i++) {
            if(this.buffer[i] == '<' || this.buffer[i] == '>')
                return true
        }
        return false
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