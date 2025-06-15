
import React from "react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  name: string;
  preview_image_url: string;
  is_premium?: boolean;
  selected?: boolean;
  onClick?: () => void;
  tabIndex?: number;
  "aria-label"?: string;
  role?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  name,
  preview_image_url,
  is_premium,
  selected,
  onClick,
  tabIndex,
  "aria-label": ariaLabel,
  role,
  onKeyDown,
}) => (
  <button
    className={cn(
      "rounded-lg border relative p-2 flex flex-col group shadow hover:shadow-lg transition-all focus:outline-none",
      selected ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-accent"
    )}
    onClick={onClick}
    aria-pressed={selected}
    aria-label={ariaLabel || `Template: ${name}${selected ? " (selected)" : ""}`}
    type="button"
    tabIndex={tabIndex}
    role={role}
    onKeyDown={onKeyDown}
  >
    <div className="aspect-video overflow-hidden rounded bg-muted relative mb-2">
      <img
        src={preview_image_url}
        alt={`Preview for ${name}`}
        className="object-cover w-full h-full transition-transform group-hover:scale-105"
      />
      {is_premium && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold text-white px-2 py-0.5 rounded">
          Pro
        </span>
      )}
    </div>
    <div className="font-semibold text-sm truncate">{name}</div>
    {selected && (
      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">Selected</div>
    )}
  </button>
);

export default TemplateCard;
