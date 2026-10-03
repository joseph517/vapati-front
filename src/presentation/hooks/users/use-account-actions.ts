import { usersService } from "@/data/users/users.service";

// Module-level, so the object and its functions are the same on every render
const accountActions = {
  deleteAccount: usersService.deleteAccount,
};

export function useAccountActions() {
  return accountActions;
}
