import SearchForm from './SearchForm';
import ResultsPanel from './ResultsPanel';

function Sidebar({ onSearch, loading, error, flightData, landmarks }) {
  return (
    <div className="sidebar">
      <h1>Window Seat Winner</h1>
      <SearchForm onSearch={onSearch} loading={loading} />
      
      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {flightData && <ResultsPanel flightData={flightData}  landmarkData={landmarks}/>}
    </div>
  );
}

export default Sidebar;