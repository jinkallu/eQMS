const fs = require('fs');
const { marked } = require('marked');

console.warn = jest.fn(); // This will silence the warning in the test output


describe('Test suit to check unit_23 marked integration', () => {
    test('Marked test', () => {
        expect(marked.parse('*hello world*', {mangle: false, headerIds: false})).toBe('<p><em>hello world</em></p>\n');
    });
    
});
