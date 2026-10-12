import { User, IUser } from "../src/models/User.js";
import { generateAccessToken } from "../src/utils/token.js";

export async function createTestUser(role: "admin" | "doctor" | "staff" = "admin", overrides: Partial<IUser> = {}) {
  const email = overrides.email || `test_${role}_${Date.now()}_${Math.random().toString(36).substring(7)}@test.com`;
  const user = await User.create({
    name: overrides.name || `Test ${role.toUpperCase()}`,
    email,
    password: overrides.password || "Password123!",
    role,
    ...overrides,
  });

  const token = generateAccessToken(user);
  return { user, token };
}
