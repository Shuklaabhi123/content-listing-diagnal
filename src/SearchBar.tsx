import React from 'react';

interface SearchBarProps {
  value: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSearch }) => (
  <div className="search-container">
    <input
      type="text"
      value={value}
      onChange={onSearch}
      placeholder="Search..."
      aria-label="Search grid items"
    />
  </div>
);

export default SearchBar;
