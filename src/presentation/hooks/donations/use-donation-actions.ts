import { donationsService } from "@/data/donations/donations.service";

// Module-level, so the object and its functions are the same on every render
const donationActions = {
  donate: donationsService.donate,
};

export function useDonationActions() {
  return donationActions;
}
