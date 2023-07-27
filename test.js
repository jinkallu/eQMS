const fs = require('fs');

describe('Test suit to check if nodejs initialized with package.json and jest', () => {
    var packageJson = null;
    beforeEach(() => {
        const packageJsonContent = fs.readFileSync('package.json', 'utf8');
        packageJson = JSON.parse(packageJsonContent);
    });

    test('Application uses package.json', () => {
        expect(packageJson).toBeDefined();
    });
    test('Jest is isntalled as devDependancy', () => {
        expect(packageJson.devDependencies.jest).toBeDefined();
    });
});
