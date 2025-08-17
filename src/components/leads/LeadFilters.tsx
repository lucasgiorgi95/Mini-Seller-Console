/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const LeadFilters: React.FC = () => {
  const { t } = useTranslation();
  const { filters, setFilters, statusCounts } = useApp();
  const [searchInput, setSearchInput] = React.useState(filters.search || '');
  
  // Usar debounce para la búsqueda
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch, setFilters]);

  const statusOptions = [
    { value: 'all', label: `${t('allStatuses')} (${statusCounts?.all || 0})` },
    { value: 'new', label: `${t('new')} (${statusCounts?.new || 0})` },
    { value: 'contacted', label: `${t('contacted')} (${statusCounts?.contacted || 0})` },
    { value: 'qualified', label: `${t('qualified')} (${statusCounts?.qualified || 0})` },
    { value: 'unqualified', label: `${t('unqualified')} (${statusCounts?.unqualified || 0})` }
  ];

  const sortOptions = [
    { value: 'score', label: t('score') },
    { value: 'name', label: t('name') },
    { value: 'company', label: t('company') },
    { value: 'source', label: t('source') }
  ];
  
  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    if (newSortBy && sortOptions.some(opt => opt.value === newSortBy)) {
      setFilters(prev => ({
        ...prev,
        sortBy: newSortBy as 'score' | 'name' | 'company' | 'source'
      }));
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      status: e.target.value as any
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      sortBy: 'score',
      sortOrder: 'desc'
    });
    setSearchInput(t('searchPlaceholder') || '');
  };

  // Get status counts from context

  // Verificar si hay filtros activos
  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' ||
    filters.sortBy !== 'score';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Barra de búsqueda */}
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="pl-10 w-full h-10 bg-gray-50 border border-gray-200 focus:bg-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        
        {/* Controles de filtro y orden */}
        <div className="flex items-center gap-3 flex-nowrap whitespace-nowrap">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              options={statusOptions}
              label=""
              className="min-w-[200px] bg-transparent hover:bg-white focus:bg-white transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
            <span className="text-sm text-gray-600 font-medium">{t('sortBy')}:</span>
            <Select
              value={filters.sortBy}
              onChange={handleSortChange}
              options={sortOptions}
              label=""
              className="min-w-[140px] bg-transparent hover:bg-white focus:bg-white transition-colors"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSortOrder}
              title={filters.sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
              className="p-1 h-10 w-10 hover:bg-white rounded-md flex items-center justify-center"
            >
              {filters.sortOrder === 'asc' ? (
                <ArrowUp className="h-6 w-6 text-blue-600" />
              ) : (
                <ArrowDown className="h-6 w-6 text-blue-600" />
              )}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className={`text-sm py-1.5 px-3 rounded-lg border ${
              hasActiveFilters 
                ? 'text-gray-700 hover:bg-gray-50 border-gray-200' 
                : 'text-gray-400 border-transparent cursor-not-allowed'
            }`}
            disabled={!hasActiveFilters}
          >
            <X className="mr-1.5 h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </div>
      
      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Filtros activos:</span>
            
            {filters.search && (
              <Badge variant="secondary" className="px-2 py-1 gap-1.5 bg-blue-50 text-blue-700 border border-blue-100">
                Buscar: "{filters.search}"
                <button 
                  onClick={() => setSearchInput('')}
                  className="ml-1 rounded-full hover:bg-blue-100 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="px-2 py-1 gap-1.5 bg-blue-50 text-blue-700 border border-blue-100">
                Estado: {statusOptions.find(opt => opt.value === filters.status)?.label}
                <button 
                  onClick={() => handleStatusChange({ target: { value: 'all' } } as React.ChangeEvent<HTMLSelectElement>)}
                  className="ml-1 rounded-full hover:bg-blue-100 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            <Badge variant="secondary" className="px-2 py-1 gap-1.5 bg-blue-50 text-blue-700 border border-blue-100">
              Orden: {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
              <span className="ml-1">
                {filters.sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};