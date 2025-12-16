import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { InputGroup, Form } from '@themesberg/react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { AdminRoutes } from '../../../routes';
import { getVipPlayerListing } from '../../../utils/apiCalls';

export default function GlobalSearchBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [showResults, setShowResults] = useState(false);

  const {
    data: users = [],
    // isLoading,
    // refetch,
  } = useQuery({
    queryKey: ['searchUsers', debouncedSearch],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.unifiedSearch = queryKey[1];
      return getVipPlayerListing(params);
    },
    select: (res) => res?.data,
    enabled: !!debouncedSearch,
  });

  const handleSearch = (event) => {
    setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''));
    setShowResults(true);
  };
  const handleNavigatePlayerDetails = (userId) => {
    navigate(`${AdminRoutes.VipPlayerDetails.split(':').shift()}${userId}`);
    setSearch('');
    setShowResults(false);
  };

  return (
    <div className='search-container'>
      <InputGroup className='mb-3 shadow-sm '>
        <InputGroup.Text>
          <img src='/svg/magnifying-glass.svg' alt='Search Icon' />
        </InputGroup.Text>
        <Form.Control
          type='search'
          value={search}
          placeholder='Search Player by username / Id / email (All Users)'
          onChange={handleSearch}
        />
      </InputGroup>
      {showResults && users && users?.users?.rows.length > 0 && (
        <ul className='search-results'>
          {users?.users?.rows?.map((user) => (
            <li key={user.userId} onClick={() => handleNavigatePlayerDetails(user.userId)}>
              {user?.username || 'NA'} (UserId : {user?.userId}) - {user?.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
