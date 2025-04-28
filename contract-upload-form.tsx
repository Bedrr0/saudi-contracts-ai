"use client";

import { useLanguage } from '@/lib/language-context';
import { useContract } from '@/lib/contract-context';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UploadIcon, FileTextIcon } from 'lucide-react';
import { useState } from 'react';
import { ContractType } from '@/lib/contract-context';

export default function ContractUploadForm() {
  const { t, language } = useLanguage();
  const { 
    file, 
    contractType, 
    isAnalyzing, 
    setFile, 
    setContractType, 
    analyzeContract 
  } = useContract();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleContractTypeChange = (value: string) => {
    // Type assertion to ensure value is a valid ContractType
    setContractType(value as ContractType);
  };

  return (
    <section id="upload" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-xl mx-auto shadow-lg border-0">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className={`text-2xl text-primary ${language === 'ar' ? 'font-cairo' : 'font-inter'}`}>
              {t('upload.title')}
            </CardTitle>
            <CardDescription>
              {t('upload.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {file ? (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <FileTextIcon className="h-4 w-4" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                    ) : (
                      <span>{t('upload.dragdrop')}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t('upload.formats')}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contract-type">{t('upload.contractType')}</Label>
                <Select
                  value={contractType}
                  onValueChange={handleContractTypeChange}
                >
                  <SelectTrigger id="contract-type" className="w-full">
                    <SelectValue placeholder={t('upload.contractType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">{t('upload.employment')}</SelectItem>
                    <SelectItem value="rental">{t('upload.rental')}</SelectItem>
                    <SelectItem value="sales">{t('upload.sales')}</SelectItem>
                    <SelectItem value="partnership">{t('upload.partnership')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={analyzeContract}
              disabled={!file || isAnalyzing}
            >
              {isAnalyzing ? t('upload.analyzing') : t('upload.analyze')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
