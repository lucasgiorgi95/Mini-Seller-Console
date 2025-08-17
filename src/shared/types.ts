export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "unqualified";
}

export interface Opportunity {
  id: string;
  name: string;
  stage:
    | "prospecting"
    | "qualification"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  amount?: number;
  accountName: string;
  leadId?: string;
  createdAt: string;
}

export interface FilterState {
  search: string;
  status: Lead["status"] | "all";
  sortBy: "score" | "name" | "company" | "source";
  sortOrder: "asc" | "desc";
}