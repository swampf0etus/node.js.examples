const requestOption = {
    method: 'GET',
    redirect: 'follow'
};

try {
    const result = await fetch("http://api.exchangeratesapi.io/v1/latest?access_key=b78cb32317d1e2b1c3d123b8b4366f21", requestOption);    
    const resultObj = await result.json();
    console.log(`Respoins JSON: ${JSON.stringify(resultObj, null, 2)}`);
} catch (error) {
    console.error('Error: API call failed.');
    throw error
}
