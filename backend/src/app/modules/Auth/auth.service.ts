import { ILoginUser, IUser } from "./auth.interface";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { createToken, verifyToken } from "./auth.utils";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../../../helpars/emailSender/emails";
import { UserRole } from "@prisma/client";

const register = async (payload: IUser) => {
  // check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  if (!payload.password) {
    throw new ApiError(400, "Password is required");
  }

  // Hash the password
  const password = await bcrypt.hash(
    payload.password,
    Number(process.env.SALT_ROUNDS)
  );

  // Update payload with hashed password
  payload.password = password;

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  sendVerificationEmail(payload.email, verificationToken);

  // 1. Create the user
  const result = await prisma.user.create({
    data: {
      email: payload.email,
      password: payload.password,
      isEmailVerified: false,
      role: payload.role as UserRole,
      verificationToken,
      verificationTokenExpiry,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  // 2. Create profile
  await prisma.profile.create({
    data: {
      userId: result.id,
      name: payload.name,
    },
  });

  return result;
};

const verifyEmail = async (email: string, token: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.verificationToken !== token || !user.verificationTokenExpiry) {
    throw new ApiError(400, "Invalid verification token");
  }

  if (user?.verificationTokenExpiry < new Date()) {
    throw new ApiError(401, "Verification token has expired");
  }

  const updatedUser = await prisma.user.update({
    where: {
      email,
    },
    data: {
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  const JwtPayload = {
    email: user.email,
    userId: user?.id,
    role: user.role,
  };

  //create toke and send to the client
  const accessToken = createToken(
    JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string
  );

  const refreshToken = createToken(
    JwtPayload,
    process.env.REFRESH_TOKEN_SECRET as string,
    process.env.REFRESH_TOKEN_EXPIRES_IN as string
  );

  return {
    message: "User verified successfully",
    updatedUser,
    accessToken,
    refreshToken,
  };
};

const login = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      isDeleted: true,
      isEmailVerified: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(401, "User is not verified");
  }

  if (user.isDeleted) {
    throw new ApiError(401, "User is deleted");
  }

  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.password,
    user?.password!
  );

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  const JwtPayload = {
    email: user.email,
    userId: user?.id,
    role: user.role,
  };

  //create toke and send to the client
  const accessToken = createToken(
    JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string
  );

  //refresh token
  const refreshToken = createToken(
    JwtPayload,
    process.env.REFRESH_TOKEN_SECRET as string,
    process.env.REFRESH_TOKEN_EXPIRES_IN as string
  );

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      phone: true,
      streetAddress: true,
      city: true,
      zipCode: true,
      region: true,
      country: true,
      Image: true,
    },
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return {
    user: {
      email: user.email,
      role: user.role,
      ...profile,
    },
    accessToken,
    refreshToken,
  };
};

const forgotPassword = async (email: string) => {
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found with this email");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 15); //15 minutes

  const link = `${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${resetToken}`;

  await sendPasswordResetEmail(email, link);

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      resetToken,
      resetTokenExpiry: tokenExpiry,
    },
  });

  return true;
};

export const resetPassword = async (
  email: string,
  token: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("User not found with this email");
  }

  if (user.resetToken !== token || !user.resetTokenExpiry) {
    throw new Error("Invalid reset token");
  }

  if (user?.resetTokenExpiry < new Date()) {
    throw new Error("Reset token has expired");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
};

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found with this email");
  }
  if (!user.password) {
    throw new ApiError(400, "Password is required");
  }

  const isPasswordMatched: boolean = await bcrypt.compare(
    oldPassword,
    user?.password!
  );

  if (!isPasswordMatched) {
    throw new ApiError(400, "Invalid credentials password not matched!");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT_ROUNDS)
  );

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  const decoded = verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  if (!decoded) {
    throw new ApiError(401, "Invalid or expired refresh token!");
  }
  console.log(decoded);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found with this refresh token");
  }

  const JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  //create toke and send to the client
  const accessToken = createToken(
    JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string
  );

  return { accessToken };
};

const resendVerifyEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new ApiError(400, "User not found with this email");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "User is already verified");
  }

  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const verificationTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      verificationToken,
      verificationTokenExpiry,
    },
  });

  sendVerificationEmail(user.email, verificationToken);

  return true;
};

interface IMakeAdmin {
  name: string;
  password: string;
  email: string;
  state: string;
  phone: string;
  zipcode: string;
}

const makeAdmin = async (payload: IUser) => {
  const { name, email, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS)
  );

  const result = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
      isEmailVerified: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isEmailVerified: true,
    },
  });

  // 2. Create profile
  await prisma.profile.create({
    data: {
      userId: result.id,
      name: payload.name,
    },
  });

  return result;
};

const handleGoogleLogin = async (profile: any) => {
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName;

  if (!email) {
    throw new ApiError(400, "Google account does not have a public email");
  }

  // Check if user already exists
  let user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isDeleted: true,
    },
  });

  // If not, register new user
  if (!user) {
    const dummyPassword = await bcrypt.hash(
      crypto.randomBytes(32).toString("hex"), // create a secure random password
      Number(process.env.SALT_ROUNDS)
    );

    user = await prisma.user.create({
      data: {
        email,
        password: dummyPassword,
        isEmailVerified: true,
        isDeleted: false,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        role: true,
        isDeleted: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await prisma.profile.create({
      data: {
        userId: user.id,
        name: name,
      },
    });
  }

  if (user.isDeleted) {
    throw new ApiError(401, "User is deleted");
  }

  const JwtPayload = {
    email: user.email,
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string
  );

  const refreshToken = createToken(
    JwtPayload,
    process.env.REFRESH_TOKEN_SECRET as string,
    process.env.REFRESH_TOKEN_EXPIRES_IN as string
  );

  const profileData = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      name: true,
      phone: true,
      streetAddress: true,
      city: true,
      zipCode: true,
      region: true,
      country: true,
      Image: true,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      ...profileData,
    },
    accessToken,
    refreshToken,
  };
};

export const AuthServices = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  resendVerifyEmail,
  makeAdmin,
  handleGoogleLogin,
};
