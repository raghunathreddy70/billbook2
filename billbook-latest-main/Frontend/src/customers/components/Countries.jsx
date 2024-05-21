// // import React, { useState } from 'react';

// // const Countries = () => {
// //   const [pincode, setPincode] = useState('');
// //   const [country, setCountry] = useState('');
// //   const [state, setState] = useState('');
// //   const [city, setCity] = useState('');

// //   const fetchLocationInfo = async () => {
// //     try {
// //         const response = await fetch(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${pincode}&username=srikanthhirola`);
// //         const data = await response.json();

// //       if (data && data.postalCodes && data.postalCodes.length > 0) {
// //         const locationData = data.postalCodes[0];
// //         setCountry(locationData.countryCode);
// //         setState(locationData.adminName1);
// //         setCity(locationData.placeName);
// //       } else {
// //         // Handle case when no data is found for the given pincode
// //         console.error('No location data found for the provided pincode.');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching location data:', error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <label>Enter Pincode: </label>
// //       <input
// //         type="text"
// //         value={pincode}
// //         onChange={(e) => setPincode(e.target.value)}
// //       />
// //       <button onClick={fetchLocationInfo}>Fetch Location Info</button>

// //       <div>
// //         <h3>Location Information:</h3>
// //         <p>Country: {country}</p>
// //         <p>State: {state}</p>
// //         <p>City: {city}</p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Countries;




// import React, { useState, useEffect } from 'react';
// import { Select, Input, Button } from 'antd';

// const { Option } = Select;

// const Countries = () => {
//   const [pincode, setPincode] = useState('');
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [states, setStates] = useState([]);
//   const [selectedState, setSelectedState] = useState('');
//   const [cities, setCities] = useState([]);
//   const [selectedCity, setSelectedCity] = useState('');

//   const fetchCountries = async () => {
//     try {
//       const response = await fetch('http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=srikanthhirola');
//       const data = await response.json();
//       setCountries(data.geonames);
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     }
//   };

//   const fetchStates = async (countryCode) => {
//     try {
//       const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${countryCode}&username=srikanthhirola`);
//       const data = await response.json();
//       setStates(data.geonames);
//     } catch (error) {
//       console.error('Error fetching states:', error);
//     }
//   };

//   const fetchCities = async (stateName) => {
//     try {
//       const response = await fetch(`http://api.geonames.org/searchJSON?name=${stateName}&featureClass=P&featureCode=PPL&maxRows=10&username=srikanthhirola`);
//       const data = await response.json();
//       setCities(data.geonames);
//     } catch (error) {
//       console.error('Error fetching cities:', error);
//     }
//   };

//   const fetchLocationInfo = async () => {
//     try {
//       const response = await fetch(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${pincode}&username=srikanthhirola`);
//       const data = await response.json();

//       if (data && data.postalCodes && data.postalCodes.length > 0) {
//         const locationData = data.postalCodes[0];
//         setSelectedCountry(locationData.countryCode);
//         setSelectedState(locationData.adminName1);
//         setSelectedCity(locationData.placeName);
//       } else {
//         console.error('No location data found for the provided pincode.');
//       }
//     } catch (error) {
//       console.error('Error fetching location data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchCountries();
//   }, []);

//   useEffect(() => {
//     if (selectedCountry) {
//       fetchStates(selectedCountry);
//     }
//   }, [selectedCountry]);

//   useEffect(() => {
//     if (selectedState) {
//       fetchCities(selectedState);
//     }
//   }, [selectedState]);

//   const handleCountryChange = (value) => {
//     setSelectedCountry(value);
//     setSelectedState('');
//     setSelectedCity('');
//   };
  

//   const handleStateChange = (value) => {
//     setSelectedState(value);
//     setSelectedCity('');
//   };

//   const handleCityChange = (value) => {
//     setSelectedCity(value);
//     // Implement pincode validation here based on the selected city if needed
//   };

//   return (
//     <div>
//       <label>Enter Pincode: </label>
//       <Input
//         value={pincode}
//         onChange={(e) => setPincode(e.target.value)}
//         style={{ width: 200 }}
//       />
//       <Button onClick={fetchLocationInfo}>Fetch Location Data</Button>

//     <div>
//       <Select
//         value={selectedCountry}
//         onChange={handleCountryChange}
//         style={{ width: 200, margin: '10px 0' }}
//         showSearch
//         placeholder="Select Country"
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//         }
//       >
//       {
//         countries && countries.length > 0 && countries.map((country) => (
//           <Option key={country.geonameId} value={country.geonameId}>
//             {country.countryName}
//           </Option>
//         ))}
//       </Select>

//       <Select
//         value={selectedState}
//         onChange={handleStateChange}
//         style={{ width: 200, margin: '10px 0' }}
//         showSearch
//         placeholder="Select State"
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//         }
//       >
//         {states && states.length > 0 ? (
//           states.map((state) => (
//             <Option key={state.geonameId} value={state.geonameId}>
//               {state.name}
//             </Option>
//           ))
//         ) : (
//           <Option value={null}>No States</Option>
//         )}
//       </Select>

//       <Select
//         value={selectedCity}
//         onChange={handleCityChange}
//         style={{ width: 200, margin: '10px 0' }}
//         showSearch
//         placeholder="Select City"
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//         }
//       >
//         {cities && cities.length > 0 ? (
//           cities.map((city) => (
//             <Option key={city.geonameId} value={city.geonameId}>
//               {city.name}
//             </Option>
//           ))
//         ) : (
//           <Option value={null}>No Cities</Option>
//         )}
//       </Select>
//     </div>
//   </div>
//   );
// };

// export default Countries;




import React, { useState, useEffect } from 'react';
import { Select, Input, Button,Spin,Alert } from 'antd';

const { Option } = Select;

const Countries = () => {
  const [pincode, setPincode] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');


const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&username=srikanthhirola');
      const data = await response.json();
      setCountries(data.geonames);
      setError(null);
    } catch (error) {
      setError('Error fetching countries. Please try again.');
      console.error('Error fetching countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async (countryCode) => {
    try {
      const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${countryCode}&username=srikanthhirola`);
      const data = await response.json();
      setStates(data.geonames);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

//   const fetchCities = async (stateName) => {
//     try {
//       const response = await fetch(`http://api.geonames.org/searchJSON?name=${stateName}&featureClass=P&featureCode=PPL&maxRows=10&username=srikanthhirola`);
//       const data = await response.json();
//       setCities(data.geonames);
//     } catch (error) {
//       console.error('Error fetching cities:', error);
//     }
//   };
const fetchCities = async (stateGeonameId) => {
  try {
    setLoading(true);
    const response = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${stateGeonameId}&featureClass=P&featureCode=PPL&maxRows=500&username=srikanthhirola`);
    const data = await response.json();
    setCities(data.geonames);
    setError(null);
  } catch (error) {
    setError('Error fetching cities. Please try again.');
    console.error('Error fetching cities:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState('');
    setSelectedCity('');
    fetchStates(value);
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedCity('');
    fetchCities(value);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
  };

  return (
//     <div>
//     <div>
//       <Select
//         value={selectedCountry}
//         onChange={handleCountryChange}
//         style={{ width: 200, margin: '10px 0' }}
//         showSearch
//         placeholder="Select Country"
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//         }
//         loading={loading}
//       >
//         {countries && countries.length > 0 && countries.map((country) => (
//           <Option key={country.geonameId} value={country.geonameId}>
//             {country.countryName}
//           </Option>
//         ))}
//       </Select>

//       <Select
//         value={selectedState}
//         onChange={handleStateChange}
//         style={{ width: 200, margin: '10px 0' }}
//         showSearch
//         placeholder="Select State"
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//         }
//         loading={loading}
//       >
//         {states && states.length > 0 && states.map((state) => (
//           <Option key={state.geonameId} value={state.geonameId}>
//             {state.name}
//           </Option>
//         ))}
//       </Select>

//       <Select
//         value={selectedCity}
//         onChange={handleCityChange}
//         style={{ width: 200, margin: '10px 0' }}
//         showSearch
//         placeholder="Select City"
//         optionFilterProp="children"
//         filterOption={(input, option) =>
//           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//         }
//         loading={loading}
//       >
//         {cities && cities.length > 0 && cities.map((city) => (
//           <Option key={city.geonameId} value={city.geonameId}>
//             {city.name}
//           </Option>
//         ))}
//       </Select>

//       {loading && <Spin style={{ marginLeft: '10px' }} />}
//         {error && <Alert type="error" message={error} style={{ marginLeft: '10px' }} />}
//     </div>
//   </div>
<div>
<Select
  value={selectedCountry}
  onChange={handleCountryChange}
  style={{ width: 200, margin: '10px 0' }}
  showSearch
  placeholder="Select Country"
  optionFilterProp="children"
  filterOption={(input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  loading={loading}
>
  {countries && countries.length > 0 && countries.map((country) => (
    <Option key={country.geonameId} value={country.geonameId}>
      {country.countryName}
    </Option>
  ))}
</Select>

{selectedCountry && (
  <Select
    value={selectedState}
    onChange={handleStateChange}
    style={{ width: 200, margin: '10px 0' }}
    showSearch
    placeholder="Select State"
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    loading={loading}
  >
    {states && states.length > 0 && states.map((state) => (
      <Option key={state.geonameId} value={state.geonameId}>
        {state.name}
      </Option>
    ))}
  </Select>
)}

{selectedState && (
  <Select
    value={selectedCity}
    onChange={handleCityChange}
    style={{ width: 200, margin: '10px 0' }}
    showSearch
    placeholder="Select City"
    optionFilterProp="children"
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    loading={loading}
  >
    {cities && cities.length > 0 && cities.map((city) => (
      <Option key={city.geonameId} value={city.geonameId}>
        {city.name}
      </Option>
    ))}
  </Select>
)}

{loading && <Spin style={{ marginLeft: '10px' }} />}
{error && <Alert type="error" message={error} style={{ marginLeft: '10px' }} />}
</div>
  );
};

export default Countries;
