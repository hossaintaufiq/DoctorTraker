process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "supersecretjwtkeyforbackendtesting123456789";
process.env.JWT_REFRESH_SECRET = "supersecretjwtrefreshkeyfortesting987654321";
process.env.CORS_ORIGIN = "http://localhost:3000";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/test_doctor_tracker";
process.env.ALLOW_DB_RESET = "false";

import { beforeAll, afterAll, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
