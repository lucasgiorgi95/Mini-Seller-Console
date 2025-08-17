import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      leads: 'Leads',
      opportunities: 'Opportunities',
      
      // Lead Management
      searchLeads: 'Search leads...',
      filterByStatus: 'Filter by status',
      allStatuses: 'All statuses',
      sortBy: 'Sort by',
      
      // Lead Status
      new: 'New',
      contacted: 'Contacted',
      qualified: 'Qualified',
      unqualified: 'Unqualified',
      
      // Lead Details
      leadDetails: 'Lead Details',
      name: 'Name',
      company: 'Company',
      email: 'Email',
      source: 'Source',
      score: 'Score',
      status: 'Status',
      
      // Actions
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      convertLead: 'Convert Lead',
      convertToOpportunity: 'Convert to Opportunity',
      
      // Opportunity
      opportunityName: 'Opportunity Name',
      stage: 'Stage',
      amount: 'Amount',
      accountName: 'Account Name',
      
      // Stages
      prospecting: 'Prospecting',
      qualification: 'Qualification',
      proposal: 'Proposal',
      negotiation: 'Negotiation',
      'closed-won': 'Closed Won',
      'closed-lost': 'Closed Lost',
      
      // Messages
      noLeadsFound: 'No leads found',
      loadingLeads: 'Loading leads...',
      errorLoadingLeads: 'Error loading leads',
      leadConverted: 'Lead converted successfully',
      changesSaved: 'Changes saved successfully',
      
      // Theme
      toggleTheme: 'Toggle theme',
      lightMode: 'Light mode',
      darkMode: 'Dark mode'
    }
  },
  es: {
    translation: {
      // Navigation
      leads: 'Leads',
      opportunities: 'Oportunidades',
      
      // Lead Management
      searchLeads: 'Buscar leads...',
      filterByStatus: 'Filtrar por estado',
      allStatuses: 'Todos los estados',
      sortBy: 'Ordenar por',
      
      // Lead Status
      new: 'Nuevo',
      contacted: 'Contactado',
      qualified: 'Calificado',
      unqualified: 'No calificado',
      
      // Lead Details
      leadDetails: 'Detalles del Lead',
      name: 'Nombre',
      company: 'Empresa',
      email: 'Email',
      source: 'Fuente',
      score: 'Puntaje',
      status: 'Estado',
      
      // Actions
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      convertLead: 'Convertir Lead',
      convertToOpportunity: 'Convertir a Oportunidad',
      
      // Opportunity
      opportunityName: 'Nombre de Oportunidad',
      stage: 'Etapa',
      amount: 'Monto',
      accountName: 'Nombre de Cuenta',
      
      // Stages
      prospecting: 'Prospección',
      qualification: 'Calificación',
      proposal: 'Propuesta',
      negotiation: 'Negociación',
      'closed-won': 'Ganada',
      'closed-lost': 'Perdida',
      
      // Messages
      noLeadsFound: 'No se encontraron leads',
      loadingLeads: 'Cargando leads...',
      errorLoadingLeads: 'Error al cargar leads',
      leadConverted: 'Lead convertido exitosamente',
      changesSaved: 'Cambios guardados exitosamente',
      
      // Theme
      toggleTheme: 'Cambiar tema',
      lightMode: 'Modo claro',
      darkMode: 'Modo oscuro'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;