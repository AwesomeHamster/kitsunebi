export interface User {
  id: number;
  name: string;
  level: number;
  role?: "owner" | "admin" | "member";
}
