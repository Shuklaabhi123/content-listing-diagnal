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
  const [showSearch, setShowSearch] = useState<boolean>(false); // Loading state

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
        <button
          className="search-button"
          onClick={() => setShowSearch(!showSearch)}
        >
          <svg
            viewBox="0,0,256,256"
            width="30px"
            height="30px"
            fill-rule="nonzero"
          >
            <g
              fill="#ffffff"
              fill-rule="nonzero"
              stroke="none"
              stroke-width="1"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              stroke-miterlimit="10"
              stroke-dasharray=""
              stroke-dashoffset="0"
              font-family="none"
              font-weight="none"
              font-size="none"
              text-anchor="none"
            >
              <g transform="scale(8.53333,8.53333)">
                <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z" />
              </g>
            </g>
          </svg>
        </button>
      </div>
      {showSearch && <SearchBar value={searchQuery} onSearch={handleSearch} />}
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
