import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

// Función para normalizar texto para búsqueda
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const useLeads = () => {
  const { leads, filters } = useApp();

  const filteredAndSortedLeads = useMemo(() => {
    // Crear una copia del array para no mutar el original
    let filtered = [...leads];

    // Filtrar por búsqueda
    if (filters.search.trim()) {
      const searchTerm = normalizeText(filters.search);
      filtered = filtered.filter(lead => {
        const searchableText = [
          lead.name,
          lead.company,
          lead.email,
          lead.source
        ].join(' ');
        
        return normalizeText(searchableText).includes(searchTerm);
      });
    }

    // Filtrar por estado
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'name':
          aValue = normalizeText(a.name);
          bValue = normalizeText(b.name);
          break;
        case 'company':
          aValue = normalizeText(a.company);
          bValue = normalizeText(b.company);
          break;
        case 'source':
          aValue = normalizeText(a.source);
          bValue = normalizeText(b.source);
          break;
        default:
          return 0;
      }

      // Manejar valores nulos o indefinidos
      if (aValue == null) return filters.sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return filters.sortOrder === 'asc' ? 1 : -1;
      
      // Ordenar
      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      
      // Si son iguales, ordenar por ID para consistencia
      return a.id.localeCompare(b.id);
    });

    return filtered;
  }, [leads, filters]);

  // Contar leads por estado para los filtros
  const statusCounts = useMemo(() => {
    const counts = {
      all: leads.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      unqualified: 0
    };

    leads.forEach(lead => {
      if (lead.status in counts) {
        counts[lead.status as keyof typeof counts]++;
      }
    });

    return counts;
  }, [leads]);

  return {
    leads: filteredAndSortedLeads,
    count: filteredAndSortedLeads.length,
    statusCounts
  };
};