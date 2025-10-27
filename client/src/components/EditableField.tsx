import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Edit2 } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  multiline?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function EditableText({ value, onSave, isEditing, multiline = false, placeholder = "", maxLength }: EditableTextProps) {
  const [editValue, setEditValue] = useState(value);
  const [isLocalEditing, setIsLocalEditing] = useState(false);

  if (!isEditing) {
    return <span className="text-foreground">{value || <span className="text-muted-foreground italic">{placeholder || "Не вказано"}</span>}</span>;
  }

  if (!isLocalEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-foreground">{value || <span className="text-muted-foreground italic">{placeholder || "Не вказано"}</span>}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditValue(value);
            setIsLocalEditing(true);
          }}
          data-testid={`button-edit-${placeholder?.toLowerCase().replace(/\s/g, '-')}`}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {multiline ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1"
          rows={3}
          data-testid={`textarea-${placeholder?.toLowerCase().replace(/\s/g, '-')}`}
        />
      ) : (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex-1"
          data-testid={`input-${placeholder?.toLowerCase().replace(/\s/g, '-')}`}
        />
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          onSave(editValue);
          setIsLocalEditing(false);
        }}
        data-testid="button-save-field"
      >
        <Check className="h-4 w-4 text-green-500" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setEditValue(value);
          setIsLocalEditing(false);
        }}
        data-testid="button-cancel-field"
      >
        <X className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

interface EditableNumberProps {
  value: number;
  onSave: (value: number) => void;
  isEditing: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  unit?: string;
}

export function EditableNumber({ value, onSave, isEditing, placeholder = "", min, max, unit = "" }: EditableNumberProps) {
  const [editValue, setEditValue] = useState(value.toString());
  const [isLocalEditing, setIsLocalEditing] = useState(false);

  if (!isEditing) {
    return <span className="text-foreground">{value} {unit}</span>;
  }

  if (!isLocalEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-foreground">{value} {unit}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditValue(value.toString());
            setIsLocalEditing(true);
          }}
          data-testid={`button-edit-${placeholder?.toLowerCase().replace(/\s/g, '-')}`}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-24"
        data-testid={`input-${placeholder?.toLowerCase().replace(/\s/g, '-')}`}
      />
      {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          const numValue = parseInt(editValue);
          if (!isNaN(numValue)) {
            onSave(numValue);
            setIsLocalEditing(false);
          }
        }}
        data-testid="button-save-field"
      >
        <Check className="h-4 w-4 text-green-500" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          setEditValue(value.toString());
          setIsLocalEditing(false);
        }}
        data-testid="button-cancel-field"
      >
        <X className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

interface EditableBadgeListProps {
  values: string[];
  onSave: (values: string[]) => void;
  isEditing: boolean;
  options: string[];
  label: string;
  multiSelect?: boolean;
}

export function EditableBadgeList({ values, onSave, isEditing, options, label, multiSelect = true }: EditableBadgeListProps) {
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(values);

  if (!isEditing) {
    if (values.length === 0) {
      return <span className="text-base text-muted-foreground italic">Не вказано</span>;
    }
    return (
      <div className="flex gap-2 flex-wrap">
        {values.map((val, i) => (
          <Badge key={i} variant="outline" className="text-base">
            {val}
          </Badge>
        ))}
      </div>
    );
  }

  if (!isLocalEditing) {
    return (
      <div className="flex flex-col gap-2">
        {values.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {values.map((val, i) => (
              <Badge key={i} variant="outline" className="text-base">
                {val}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-base text-muted-foreground italic">Не вказано</span>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedValues(values);
            setIsLocalEditing(true);
          }}
          data-testid={`button-edit-${label.toLowerCase().replace(/\s/g, '-')}`}
        >
          <Edit2 className="h-3 w-3 mr-2" />
          Змінити
        </Button>
      </div>
    );
  }

  const toggleValue = (val: string) => {
    if (multiSelect) {
      if (selectedValues.includes(val)) {
        setSelectedValues(selectedValues.filter(v => v !== val));
      } else {
        setSelectedValues([...selectedValues, val]);
      }
    } else {
      setSelectedValues([val]);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/30">
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <Badge
            key={option}
            variant={selectedValues.includes(option) ? "default" : "outline"}
            className="cursor-pointer text-base hover-elevate"
            onClick={() => toggleValue(option)}
            data-testid={`badge-option-${option.toLowerCase().replace(/\s/g, '-')}`}
          >
            {option}
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            onSave(selectedValues);
            setIsLocalEditing(false);
          }}
          data-testid="button-save-field"
        >
          <Check className="h-4 w-4 mr-2" />
          Зберегти
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedValues(values);
            setIsLocalEditing(false);
          }}
          data-testid="button-cancel-field"
        >
          <X className="h-4 w-4 mr-2" />
          Скасувати
        </Button>
      </div>
    </div>
  );
}
