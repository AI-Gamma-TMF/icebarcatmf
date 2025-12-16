import React from 'react';
import { InputGroup, Form } from '@themesberg/react-bootstrap';
export default function SearchBar({ search, setSearch }) {
  return (
    <InputGroup className='mb-3 shadow-sm '>
      <Form.Control
        type='search'
        value={search}
        placeholder='Search Player by username / Id / email'
        onChange={(event) => setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))}
      />
    </InputGroup>
  );
}
