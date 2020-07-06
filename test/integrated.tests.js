const assert = require('assert');
const markupRemover = require('../src/markupRemover')


describe('Integrated tests', () => {

    it('should return "abc"', () => {
        let mr = new markupRemover('<b>abc</b>', '\n')

        assert.strictEqual(mr.removeMarkup(), 'abc')
    })

    it('should return "B\truh asd\t\tbbb\t"', () => {
        let mr = new markupRemover('<b>B</b>ruh asd<b><i>bbb</i></b>', '\t')

        assert.strictEqual(mr.removeMarkup(), 'B\truh asd\t\tbbb\t')
    }),

    it(`should return "
    
    
    Page Title
    
    
    
    This is a Heading
    This is a paragraph.
    
    
    "`, () => {
        let mr = new markupRemover(
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
                '')

        assert.strictEqual(
            mr.removeMarkup(), 
`


Page Title



This is a Heading
This is a paragraph.


`)
    })
})
