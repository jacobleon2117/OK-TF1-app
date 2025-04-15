import { MissionReport } from './reportDataUtils';

/**
 * filter reports by status
 */
export const filterReportsByStatus = (
  reports: MissionReport[],
  status: MissionReport['status']
): MissionReport[] => {
  return reports.filter(report => report.status === status);
};

/**
 * filter reports by date range
 */
export const filterReportsByDateRange = (
  reports: MissionReport[],
  startDate: Date,
  endDate: Date
): MissionReport[] => {
  return reports.filter(report => {
    const reportDate = report.createdAt.toDate();
    return reportDate >= startDate && reportDate <= endDate;
  });
};

/**
 * sort reports by date (newest first)
 */
export const sortReportsByDate = (reports: MissionReport[]): MissionReport[] => {
  return [...reports].sort((a, b) => {
    return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
  });
};

/**
 * search reports by title or description
 */
export const searchReports = (reports: MissionReport[], searchTerm: string): MissionReport[] => {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return reports.filter(
    report =>
      report.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      report.description.toLowerCase().includes(lowerCaseSearchTerm)
  );
};
