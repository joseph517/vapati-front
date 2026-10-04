import { adminReportsService } from "@/data/admin/admin-reports.service";

// Module-level, so the object and its functions are the same on every render
const adminReportActions = {
  review: adminReportsService.review,
};

export function useAdminReportActions() {
  return adminReportActions;
}
