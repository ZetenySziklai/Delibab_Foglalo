module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    maxWorkers: 1, // Soros futtatás - megosztott SQLite :memory: adatbázis miatt
    collectCoverageFrom: [
        'api/**/*.js',
        '!api/db/**',
        '!api/models/**',
        '!api/routes/**',
        '!api/errors/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true,
    setupFiles: ['<rootDir>/tests/tests/setup.js']
};

