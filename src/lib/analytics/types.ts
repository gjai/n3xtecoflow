export type HostDayStats = {
  views: number;
  contacts: number;
  paths: Record<string, number>;
};

export type DayStats = {
  hosts: Record<string, HostDayStats>;
};

export type AnalyticsStore = {
  updatedAt: string;
  /** YYYY-MM-DD in Europe/Paris */
  days: Record<string, DayStats>;
};

export const ANALYTICS_RETENTION_DAYS = 60;
