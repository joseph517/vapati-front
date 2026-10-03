import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  CreateUserRequest,
  DeleteUserResponse,
  UpdateUserRequest,
  UserDTO,
  UserProfileResponse,
} from "@/domain/users/user.types";

type UserId = string | number;

const keys = {
  // The id comes from the URL, so it is encoded
  profile: (userId: UserId) => `/api/users/${encodeURIComponent(userId)}`,
};

export const usersService = {
  keys,
  // Public. Does not return a token
  create: (body: CreateUserRequest) =>
    apiFetch("/api/users/create", { method: "POST", body }),
  update: (body: UpdateUserRequest) =>
    apiFetch<UserDTO>("/api/users/update", { method: "PUT", body, ...auth() }),
  deleteAccount: () =>
    apiFetch<DeleteUserResponse>("/api/users/delete", {
      method: "DELETE",
      ...auth(),
    }),
  getProfile: (userId: UserId) =>
    apiFetch<UserProfileResponse>(keys.profile(userId), auth()),
};
