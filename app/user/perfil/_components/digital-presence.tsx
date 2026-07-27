'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSocialIcon, SOCIAL_PLATFORMS } from '@/lib/social-icons';
import type { SocialLink } from '@/lib/profile-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DigitalPresenceProps {
  website: string;
  whatsapp: string;
  socialLinks: SocialLink[];
  onChange: (field: string, value: unknown) => void;
}

export function DigitalPresence({
  website,
  whatsapp,
  socialLinks,
  onChange,
}: DigitalPresenceProps) {
  const [addingSocial, setAddingSocial] = useState(false);
  const [newPlatform, setNewPlatform] = useState(SOCIAL_PLATFORMS[0].value);

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => !socialLinks.some((s) => s.platform === p.value)
  );

  const handleAddSocial = () => {
    if (socialLinks.some((s) => s.platform === newPlatform)) return;
    onChange('socialLinks', [
      ...socialLinks,
      { platform: newPlatform, url: '', orden: socialLinks.length },
    ]);
    setAddingSocial(false);
  };

  const handleRemoveSocial = (index: number) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    onChange('socialLinks', updated);
  };

  const handleSocialUrlChange = (index: number, url: string) => {
    const updated = socialLinks.map((s, i) => (i === index ? { ...s, url } : s));
    onChange('socialLinks', updated);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">🌐</span>
          <h2 className="text-lg font-semibold text-foreground">Presencia Digital y Contacto</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
                Sitio Web Oficial
              </Label>
              <Input value={website} onChange={(e) => onChange('website', e.target.value)} />
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase">
                WhatsApp Business
              </Label>
              <Input value={whatsapp} onChange={(e) => onChange('whatsapp', e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-xs font-medium text-muted-foreground mb-3 block uppercase">
                Redes Sociales
              </Label>
              <div className="space-y-2 mb-3">
                {socialLinks.map((link, index) => (
                  <div key={link.id ?? index} className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted shrink-0">
                      {getSocialIcon(link.platform || '', 'h-4 w-4 text-muted-foreground')}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-20 truncate uppercase shrink-0">
                      {link.platform || ''}
                    </span>
                    <Input
                      placeholder={`URL de ${link.platform}`}
                      value={link.url}
                      onChange={(e) => handleSocialUrlChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <button
                      onClick={() => handleRemoveSocial(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {addingSocial ? (
                <div className="flex items-center gap-2">
                  <Select value={newPlatform} onValueChange={setNewPlatform}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePlatforms.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" size="sm" onClick={handleAddSocial}>
                    Agregar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddingSocial(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewPlatform(availablePlatforms[0]?.value ?? SOCIAL_PLATFORMS[0].value);
                    setAddingSocial(true);
                  }}
                  disabled={availablePlatforms.length === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar red social
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
