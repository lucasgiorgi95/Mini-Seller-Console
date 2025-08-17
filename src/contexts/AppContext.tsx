import React, { createContext, useContext, useState, useEffect } from "react";
import leadsData from "../data/leads.json";
import type { Lead, Opportunity, FilterState } from "../shared/types";

// Re-export types for convenience
export type { Lead, Opportunity, FilterState };

interface AppContextType {
  // Leads
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addLeads: (newLeads: Omit<Lead, 'id'>[]) => Promise<void>;

  // Opportunities
  opportunities: Opportunity[];
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt'>) => Promise<void>;

  // Filters
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  statusCounts: {
    all: number;
    new: number;
    contacted: number;
    qualified: number;
    unqualified: number;
  };

  // UI State
  selectedLead: Lead | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<Lead | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

// Load data from localStorage or initialize with default values
const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Load leads and opportunities from localStorage or use default values
  const [leads, setLeads] = useState<Lead[]>(() =>
    loadFromLocalStorage<Lead[]>('leads', leadsData as Lead[])
  );
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    loadFromLocalStorage<Opportunity[]>("opportunities", [])
  );

  // Save to localStorage whenever leads or opportunities change
  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  // Add multiple new leads
  const addLeads = async (newLeads: Omit<Lead, 'id'>[]) => {
    const leadsWithIds = newLeads.map(lead => ({
      ...lead,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));
    
    setLeads(prev => [...leadsWithIds, ...prev]);
  };

  // Add a new opportunity
  const addOpportunity = async (opportunityData: Omit<Opportunity, 'id' | 'createdAt' | 'leadId'> & { leadId?: string }) => {
    const newOpportunity: Opportunity = {
      ...opportunityData,
      id: `opp-${Date.now()}`,
      leadId: opportunityData.leadId || '',
      createdAt: new Date().toISOString(),
    };
    
    setOpportunities(prev => [newOpportunity, ...prev]);
  };

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>(() => {
    const saved = localStorage.getItem("leadFilters");
    return saved
      ? JSON.parse(saved)
      : {
          search: "",
          status: "all" as const,
          sortBy: "score" as const,
          sortOrder: "desc" as const,
        };
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLeads(leadsData as Lead[]);

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save to localStorage whenever leads or opportunities change
  useEffect(() => {
    try {
      localStorage.setItem('leads', JSON.stringify(leads));
    } catch (error) {
      console.error('Error saving leads to localStorage:', error);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('opportunities', JSON.stringify(opportunities));
    } catch (error) {
      console.error('Error saving opportunities to localStorage:', error);
    }
  }, [opportunities]);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem("leadFilters", JSON.stringify(filters));
  }, [filters]);

  // Update lead status
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => {
      return prev.map(lead => 
        lead.id === id ? { ...lead, ...updates } : lead
      );
    });
  };

  // Calculate status counts
  const statusCounts = React.useMemo(() => ({
    all: leads.length,
    new: leads.filter(lead => lead.status === 'new').length,
    contacted: leads.filter(lead => lead.status === 'contacted').length,
    qualified: leads.filter(lead => lead.status === 'qualified').length,
    unqualified: leads.filter(lead => lead.status === 'unqualified').length
  }), [leads]);

  return (
    <AppContext.Provider
      value={{
        // Leads
        leads,
        setLeads,
        updateLead,
        addLeads,

        // Opportunities
        opportunities,
        addOpportunity,
        filters,
        setFilters,
        statusCounts,
        selectedLead,
        setSelectedLead,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
