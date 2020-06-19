const assert = require('assert');
const markupRemover = require('../src/index')


describe('Integrated tests', () => {

    it('should return "abc"', () => {
        assert.strictEqual(markupRemover.removeMarkup('<b>abc</b>', '\n'), 'abc')
    })

    it('should return "bbb"', () => {
        assert.strictEqual(markupRemover.removeMarkup('<i>bbb</i>', '\n'), 'bbb')
    }),

    it(`should return "
    
    
    Page Title
    
    
    
    This is a Heading
    This is a paragraph.
    
    
    "`, () => {
        assert.strictEqual(
            markupRemover.removeMarkup(
`<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>This is a Heading</h1>
<p>This is a paragraph.</p>

</body>
</html>`,
        ''
        ), 
`


Page Title



This is a Heading
This is a paragraph.


`)
    })
})
