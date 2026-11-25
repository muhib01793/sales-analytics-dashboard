import { memo } from 'react';
import { ALL } from '../utils/constants.js';
import { formatInteger } from '../utils/format.js';

function SelectField({ label, value, onChange, options, allLabel }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select value={value} onChange={onChange}>
        <option value={ALL}>{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FiltersBar({ filters, options, bounds, matchCount, onFilterChange, onReset }) {
  const handle = (key) => (event) => onFilterChange(key, event.target.value);

  return (
    <section className="filters" aria-label="Order filters">
      <div className="filters__grid">
        <label className="field field--search">
          <span className="field__label">Search</span>
          <input
            type="search"
            placeholder="Order ID, customer, category, region"
            value={filters.search}
            onChange={handle('search')}
          />
        </label>

        <label className="field">
          <span className="field__label">From</span>
          <input
            type="date"
            min={bounds.min}
            max={filters.dateTo || bounds.max}
            value={filters.dateFrom}
            onChange={handle('dateFrom')}
          />
        </label>

        <label className="field">
          <span className="field__label">To</span>
          <input
            type="date"
            min={filters.dateFrom || bounds.min}
            max={bounds.max}
            value={filters.dateTo}
            onChange={handle('dateTo')}
          />
        </label>

        <SelectField
          label="Region"
          value={filters.region}
          onChange={handle('region')}
          options={options.regions}
          allLabel="All regions"
        />
        <SelectField
          label="Category"
          value={filters.category}
          onChange={handle('category')}
          options={options.categories}
          allLabel="All categories"
        />
        <SelectField
          label="Status"
          value={filters.status}
          onChange={handle('status')}
          options={options.statuses}
          allLabel="All statuses"
        />
      </div>

      <div className="filters__footer">
        <p className="filters__count">
          <strong>{formatInteger(matchCount)}</strong> orders match your filters
        </p>
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Reset filters
        </button>
      </div>
    </section>
  );
}

export default memo(FiltersBar);
