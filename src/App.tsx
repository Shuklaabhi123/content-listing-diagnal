import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { DataItem } from './types';
import SearchBar from './SearchBar';
import GridItem from './GridItem';

// Base API URL
const BASE_API_URL = 'https://test.create.diagnal.com/';

// Function to fetch data for the current page
const fetchData = async (pageNumber: number): Promise<DataItem[]> => {
  try {
    const response = await axios.get(
      `${BASE_API_URL}data/page${pageNumber}.json`
    );
    console.log('rtee', response.data);
    return response.data.page['content-items']['content'];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]); // Loaded data
  const [page, setPage] = useState(1); // Current page for lazy loading
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query for filtering
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const gridRef = useRef<HTMLDivElement | null>(null); // Reference for grid container to monitor scroll

  // Fetch data on page load and when page is incremented
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const newData = await fetchData(page);
      setData((prevData) => [...prevData, ...newData]); // Append data to existing data
      setLoading(false);
    };
    loadData();
  }, [page]);

  // Handle scroll event for infinite scrolling
  const handleScroll = useCallback(() => {
    if (gridRef.current) {
      const bottom = gridRef.current.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      if (bottom <= windowHeight && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <div className="header">
        <button className="back-arrow">
          {/* Back arrow icon (SVG or FontAwesome, etc.) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-arrow-left"
          >
            <path d="M19 12H5" />
            <path d="M12 5l-7 7 7 7" />
          </svg>
        </button>
        <h1 className="title">Romantic Comedy</h1>
      </div>
      <SearchBar value={searchQuery} onSearch={handleSearch} />
      <div className="grid-container" ref={gridRef}>
        {filteredData.map((item, index) => (
          <GridItem
            key={index}
            title={item.name}
            imageUrl={`${BASE_API_URL}images/${item['poster-image']}`}
          />
        ))}
        {loading && <div>Loading more...</div>}
      </div>
    </div>
  );
};

export default App;
