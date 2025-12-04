import { useState } from 'react';

function SearchForm({ onSearch, loading }) {
  const [flightNumber, setFlightNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (flightNumber.trim()) {
      onSearch(flightNumber.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <label>Flight Number:</label>
      <input 
        type="text" 
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value)}
        placeholder="e.g., DL2626, UA123"
        disabled={loading}
      />
      <button type="submit" disabled={loading || !flightNumber.trim()}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchForm;