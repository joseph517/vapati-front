import { reportsService } from "@/data/reports/reports.service";

// Module-level, so the object and its functions are the same on every render
const reportActions = {
  create: reportsService.create,
};

export function useReportActions() {
  return reportActions;
}
