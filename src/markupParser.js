class MarkupParser {
    text = ''
    tagSplits = []
    invalidMarkupIndex = -1

    constructor(text) {
        this.text = text
    }

    isMarkupPresent() {
        if(this.text.includes('<') || this.text.includes('>')) {
            return true
        }
        return false
    }

    isMarkupParseable() {
        this.splitMarkupByTagStart()
        if(this.markupStartsWithCloseBracket()) 
            return false
        if(this.markupHasDuplicateOrNoCloseBrackets())
            return false
        return true
    }

    splitMarkupByTagStart() {
        this.tagSplits = this.text.split('<')
    }

    markupStartsWithCloseBracket() {
        if(this.tagSplits[0].includes('>')) {
            this.invalidMarkupIndex = this.tagSplits[0].indexOf('>')
            return true
        }
        return false
    }

    markupHasDuplicateOrNoCloseBrackets() {
        for(let i = 1; i < this.tagSplits.length; i++) {
            if(this.tagHasNoClosingBracket(i))
                return true
            if(this.tagHasDuplicateClosingBrackets(i))
                return true
        }
        return false
    }

    tagHasNoClosingBracket(index) {
        if(!this.tagSplits[index].includes('>')) {
            this.invalidMarkupIndex = this.tagIndexInOriginalText(index)
            return true
        }
        return false
    }

    tagIndexInOriginalText(index) {
        let originalIndex = -1
        for(let i = 0; i < index; i++) {
            originalIndex += this.tagSplits[i].length + 1
        }
        return originalIndex
    }

    tagHasDuplicateClosingBrackets(index) {
        if(this.tagSplits[index].indexOf('>') != this.tagSplits[index].lastIndexOf('>')) {
            const duplicateBracketCharNumber = this.tagSplits[index].lastIndexOf('>') + 1
            this.invalidMarkupIndex = this.tagIndexInOriginalText(index) + duplicateBracketCharNumber
            return true
        }
        return false
    }
}

module.exports = MarkupParser