// Környezeti változók beállítása a tesztekhez
process.env.NODE_ENV = 'test';
// Fájl alapú SQLite (:memory: problémákat okozhat bulkCreate/create esetén)
process.env.DB_NAME = process.env.DB_NAME || './test-db.sqlite';
process.env.DB_USER = process.env.DB_USER || '';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || '';
process.env.DB_HOST = process.env.DB_HOST || '';
process.env.DB_DIALECT = process.env.DB_DIALECT || 'sqlite';
process.env.DB_PORT = process.env.DB_PORT || '';

