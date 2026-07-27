'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Trash2 } from 'lucide-react';
import { getRuleName, getRuleDescription, getRuleIcon, getRuleColors } from '@/lib/domain/rules';
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import type { ScoringRulesFormValues } from '@/components/forms/schemas';

interface RuleCardProps {
  index: number;
  ruleType: string;
  catalogDescription?: string;
  form: UseFormReturn<ScoringRulesFormValues>;
  fields: UseFieldArrayReturn<ScoringRulesFormValues, 'rules', 'id'>['fields'];
  remove: UseFieldArrayReturn<ScoringRulesFormValues, 'rules', 'id'>['remove'];
}

export function RuleCard({
  index,
  ruleType,
  catalogDescription,
  form,
  fields,
  remove,
}: RuleCardProps) {
  const name = getRuleName(ruleType);
  const description = catalogDescription ?? getRuleDescription(ruleType);
  const Icon = getRuleIcon(ruleType);
  const { bgColor, borderColor } = getRuleColors(ruleType);

  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${bgColor} ${borderColor}`}>
      {/* Icon */}
      <div className="flex-shrink-0">
        {Icon ? <Icon className="h-5 w-5" /> : <div className="h-5 w-5 rounded-full bg-gray-300" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Score Input */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase">Puntaje</span>
        <FormField
          control={form.control}
          name={`rules.${index}.weight`}
          render={({ field: weightField }) => (
            <FormItem className="space-y-0">
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  className="w-20 text-center font-semibold"
                  {...weightField}
                  value={weightField.value === 0 ? '' : weightField.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      weightField.onChange(0);
                    } else {
                      const num = parseInt(val);
                      if (!isNaN(num) && num <= 100) {
                        weightField.onChange(num);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Delete Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => remove(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
