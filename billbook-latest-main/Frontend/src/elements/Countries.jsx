import React, { useState, useEffect } from 'react';

const CountrySelector = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    // Fetch countries on component mount
    fetch('https://restcountries.com/v2/all')
      .then((response) => response.json())
      .then((data) => setCountries(data));
  }, []);

  const handleCountryChange = (event) => {
    const countryName = event.target.value;
    setSelectedCountry(countryName);
    setSelectedState('');
    setSelectedCity('');

    // Fetch states for the selected country
    fetch(`https://restcountries.com/v2/name/${countryName}?fullText=true`)
      .then((response) => response.json())
      .then((data) => setStates(data[0]?.states || []));
  };

  const handleStateChange = (event) => {
    const stateName = event.target.value;
    setSelectedState(stateName);
    setSelectedCity('');

    // Fetch cities for the selected state
    // You might need to use a separate API for city data
    // For simplicity, let's assume the states have cities as an example
    setCities(states.find((state) => state.name === stateName)?.cities || []);
  };

  const handleCityChange = (event) => {
    const cityName = event.target.value;
    setSelectedCity(cityName);
  };

  return (
    <div>
      <label>Select Country:</label>
      <select onChange={handleCountryChange} value={selectedCountry}>
        <option value="">Select</option>
        {countries.map((country) => (
          <option key={country.name} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>

      {selectedCountry && (
        <div>
          <label>Select State:</label>
          <select onChange={handleStateChange} value={selectedState}>
            <option value="">Select</option>
            {states.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedState && (
        <div>
          <label>Select City:</label>
          <select onChange={handleCityChange} value={selectedCity}>
            <option value="">Select</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
