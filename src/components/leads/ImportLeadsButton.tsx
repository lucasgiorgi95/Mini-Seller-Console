import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '../ui/Button';
import * as XLSX from 'xlsx';
import { useApp } from '../../contexts/AppContext';
import { useNotifications } from '../../contexts/NotificationContext';

export const ImportLeadsButton: React.FC = () => {
  const { t } = useTranslation();
  const { addLeads } = useApp();
  const { success, error } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsImporting(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Transform and validate the data
      const leads = jsonData.map((row: any) => ({
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: row[t('name')] || row['Name'] || '',
        company: row[t('company')] || row['Company'] || '',
        email: row[t('email')] || row['Email'] || '',
        source: row[t('source')] || row['Source'] || 'imported',
        score: parseInt(row[t('score')] || row['Score'] || '0', 10) || 0,
        status: 'new' as const,
      }));

      // Add leads to the app state
      await addLeads(leads);
      
      success(t('leadsImported'));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileName(null);
    } catch (err) {
      console.error('Error importing leads:', err);
      error(t('importError'));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        title={t('importLeads')}
        className="hidden"
        disabled={isImporting}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="flex items-center gap-2"
      >
        {isImporting ? (
          <>
            <span className="animate-spin">
              <FileText className="w-4 h-4" />
            </span>
            {t('importing')}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            {t('importLeads')}
          </>
        )}
      </Button>
      
      {fileName && (
        <div className="mt-2 flex items-center text-sm text-gray-600" title={t('fileName')}>
          <span className="truncate max-w-xs">{fileName}</span>
          <button 
            onClick={() => setFileName(null)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportLeadsButton;
