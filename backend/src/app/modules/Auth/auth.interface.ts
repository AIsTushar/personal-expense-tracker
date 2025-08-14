import { UserRole } from "@prisma/client";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}
