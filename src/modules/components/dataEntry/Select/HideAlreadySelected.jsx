import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const DebounceSelect=({ fetchOptions, debounceTimeout = 800, ...props })=> {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = () => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  };
  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}
      options={options}
    />
  );
}

const fetchUserList=async ()=> {
  return fetch('https://randomuser.me/api/?results=5')
    .then((response) => response.json())
    .then((body) =>
      body.results.map((user) => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      })),
    );
}

const HideAlreadySelected = () => {
  const [value, setValue] = useState([]);
  return (
    <DebounceSelect
      mode='multiple'
      value={value}
      placeholder='Select users'
      fetchOptions={fetchUserList}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      style={{
        width: '100%',
      }}
    />
  );
};

export default HideAlreadySelected;
DebounceSelect.propTypes = {
  fetchOptions: PropTypes.any,
  debounceTimeout: PropTypes.any,
};
