export const getCurrencyConversionData = async () => {
  console.log('Loading currency conversion data via API call...');
  const options = {
    method: 'GET',
    redirect: 'follow',
  };

  const apiKey = 'b78cb32317d1e2b1c3d123b8b4366f21';
  const response = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`, options);

  if (!response.ok) {
    throw new Error(`Error calling API. Status: ${response.status}`);
  }

  return response.json();
};

export const getSalary = (amountUSD, currency, currenceData) => {
  // As API base currency is EUR and salaries are stored in USD, we have to conver to USD first
  const amount = (currency === 'USD') ? amountUSD : (amountUSD / currenceData.rates.USD) * currenceData.rates[currency];
  const formatter = Intl.NumberFormat('us-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
};
