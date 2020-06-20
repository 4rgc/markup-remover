const assert = require('assert');
const markupRemover = require('../src/index')


describe('Integrated tests', () => {

    it('should return "abc"', () => {
        assert.strictEqual(markupRemover.removeMarkup('<b>abc</b>', '\n'), 'abc')
    })

    it('should return "B\truh asd\t\tbbb\t"', () => {
        assert.strictEqual(markupRemover.removeMarkup('<b>B</b>ruh asd<b><i>bbb</i></b>', '\t'), 'B\truh asd\t\tbbb\t')
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
