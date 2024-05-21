import React, { useState } from 'react';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';

const LocationSelector = () => {
  const [countryCode, setCountryCode] = useState('');
  console.log("country", Country.getAllCountries());
  console.log("countryCode", countryCode);
  const [stateCode, setStateCode] = useState('');
  const [cityName, setCityName] = useState('');

  const handleCountryChange = (selectedOption) => {
    setCountryCode(selectedOption.value);
    setStateCode('');
    setCityName('');
  };

  const handleStateChange = (selectedOption) => {
    setStateCode(selectedOption.value);
    setCityName('');
  };

  const handleCityChange = (selectedOption) => {
    setCityName(selectedOption.value);
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
        value={countryCode ? { value: countryCode, label: Country.getCountryByCode(countryCode).name } : null}
      />
      <Select
        options={State ? State.getStatesOfCountry(countryCode).map(({ isoCode, name }) => ({
          value: isoCode,
          label: name
        })) : []}
        onChange={handleStateChange}
        placeholder="Select State"
        value={stateCode ? { value: stateCode, label: State.getStateByCodeAndCountry(stateCode, countryCode).name } : null}
        isDisabled={!countryCode}
      />
      <Select
        options={City ? City.getCitiesOfState(countryCode, stateCode).map(({ name }) => ({
          value: name,
          label: name
        })) : []}
        onChange={handleCityChange}
        placeholder="Select City"
        value={cityName ? { value: cityName, label: cityName } : null}
        isDisabled={!stateCode}
      />
    </div>
  );
};

export default LocationSelector;
