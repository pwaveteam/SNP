export interface SafetyDocument {
  workplace?: string
  applicationDate?: string
  requestDept?: string
  workerCount?: number
  workDate?: string
  applicant?: string
  workLocation?: string
  workType?: string
  otherSafety?: string
  workers?: string[]
  createdBy?: string
  safetyChecks?: Record<string, unknown>
}
