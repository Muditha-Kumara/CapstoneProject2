import { User } from "../types";

export function getUser(): User {
  return {
    id: 1,
    name: "Sample User",
    email: "sample@example.com",
  };
}
