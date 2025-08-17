import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../contexts/AppContext';
import { LeadRow } from './LeadRow';
import { LeadFilters } from './LeadFilters';
import type { Lead } from '../../shared/types';

interface LeadsListProps {
  onSelectLead: (lead: Lead) => void;
}

export const LeadsList: React.FC<LeadsListProps> = ({ onSelectLead }) => {
  const { t } = useTranslation();
  const { leads, filters, isLoading, setFilters } = useApp();
  
  // Verificar si hay filtros activos
  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' ||
    filters.sortBy !== 'score';
    
  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      sortBy: 'score',
      sortOrder: 'desc'
    });
  };

  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads;

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [leads, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('loadingLeads')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Filtros */}
      <LeadFilters />

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredAndSortedLeads.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="text-gray-600 text-lg mb-2">
                {t('noLeadsFound')}
              </p>
              {hasActiveFilters && (
                <button 
                  onClick={clearFilters}
                  className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {t('clearAllFilters')}
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {t('name')}
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                      {t('company')}
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                      {t('email')}
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {t('score')}
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {t('status')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAndSortedLeads.map((lead) => (
                    <LeadRow 
                      key={lead.id} 
                      lead={lead} 
                      onClick={() => onSelectLead(lead)} 
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};