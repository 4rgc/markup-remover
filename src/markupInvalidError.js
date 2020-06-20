class MarkupInvalidError extends Error {
    message
    line
    character

    constructor(message, line, character) {
        super()
        this.message = message
        this.line = line
        this.character = character
    }
}

module.exports = MarkupInvalidError