module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverageFrom: [
        'api/**/*.js',
        '!api/db/**',
        '!api/models/**',
        '!api/routes/**',
        '!api/errors/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true,
    setupFiles: ['<rootDir>/tests/setup.js']
};

