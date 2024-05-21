import React, { useState } from 'react';
import { Country, State, City }  from 'react-country-state-city';
import Select from 'react-select';

const LocationSelector = () => {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const handleCountryChange = (selectedOption) => {
    setCountry(selectedOption.value);
    setState('');
    setCity('');
  };

  const handleStateChange = (selectedOption) => {
    setState(selectedOption.value);
    setCity('');
  };

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption.value);
  };

  return (
    <div>
      <Select
        options={Country.getAllCountries().map(({ isoCode, name }) => ({
          value: isoCode,
          label: name
        }))}
        onChange={handleCountryChange}
        placeholder="Select Country"
        value={country ? { value: country, label: Country.getCountryByCode(country).name } : null}
      />
      <Select
        options={State.getStatesOfCountry(country).map(({ isoCode, name }) => ({
          value: isoCode,
          label: name
        }))}
        onChange={handleStateChange}
        placeholder="Select State"
        value={state ? { value: state, label: State.getStateByCodeAndCountry(state, country).name } : null}
        isDisabled={!country}
      />
      <Select
        options={City.getCitiesOfState(country, state).map(({ name }) => ({
          value: name,
          label: name
        }))}
        onChange={handleCityChange}
        placeholder="Select City"
        value={city ? { value: city, label: city } : null}
        isDisabled={!state}
      />
    </div>
  );
};

export default LocationSelector;
