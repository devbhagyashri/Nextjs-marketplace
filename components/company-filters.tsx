"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/lib/constants";

type CompanyFiltersProps = {
  search: string;
  industry: string;
  minPrice: string;
  maxPrice: string;
  onSearchChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
};

export function CompanyFilters({
  search,
  industry,
  minPrice,
  maxPrice,
  onSearchChange,
  onIndustryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}: CompanyFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        placeholder="Search companies..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <select
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
        value={industry}
        onChange={(event) => onIndustryChange(event.target.value)}
      >
        <option value="">All industries</option>
        {INDUSTRIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <Input
        type="number"
        min="0"
        placeholder="Min price"
        value={minPrice}
        onChange={(event) => onMinPriceChange(event.target.value)}
      />
      <Input
        type="number"
        min="0"
        placeholder="Max price"
        value={maxPrice}
        onChange={(event) => onMaxPriceChange(event.target.value)}
      />
      <Button type="button" variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
