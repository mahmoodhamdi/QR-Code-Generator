'use client';

import { useState, useEffect } from 'react';
import { useQRStore } from '@/stores/qr-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { PRESET_TEMPLATES, DEFAULT_CUSTOMIZATION } from '@/lib/constants';
import { QRTemplate, QRCustomization } from '@/types/qr';
import { generateQRWithLogo } from '@/lib/qr/generator';
import { Search, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function QRTemplates() {
  const router = useRouter();
  const { setCustomization } = useQRStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Get unique categories
  const categories = [...new Set(PRESET_TEMPLATES.map((t) => t.category))];

  // Filter templates
  const filteredTemplates = PRESET_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Generate preview images for templates
  useEffect(() => {
    const generatePreviews = async () => {
      setLoadingPreviews(true);
      const sampleData = 'https://example.com';
      const newPreviews: Record<string, string> = {};

      for (const template of PRESET_TEMPLATES) {
        try {
          const customization: QRCustomization = {
            ...DEFAULT_CUSTOMIZATION,
            ...template.customization,
            size: 200,
          };

          const preview = await generateQRWithLogo({
            data: sampleData,
            customization,
          });

          newPreviews[template.id] = preview;
        } catch {
          // Skip failed previews
        }
      }

      setPreviews(newPreviews);
      setLoadingPreviews(false);
    };

    generatePreviews();
  }, []);

  // Apply template
  const applyTemplate = (template: QRTemplate) => {
    setSelectedTemplate(template.id);
    setCustomization({
      ...DEFAULT_CUSTOMIZATION,
      ...template.customization,
    });

    toast.success(`Applied "${template.name}" template`);

    // Navigate to generator after a short delay
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-3">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Templates Grid */}
      {loadingPreviews ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => applyTemplate(template)}
              >
                <CardContent className="p-4">
                  {/* Preview */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-white mb-3 relative">
                    {previews[template.id] ? (
                      <img
                        src={previews[template.id]}
                        alt={template.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    )}

                    {/* Selected overlay */}
                    {selectedTemplate === template.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="p-2 rounded-full bg-primary">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button size="sm" variant="secondary">
                        Use Template
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">{template.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loadingPreviews && filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
