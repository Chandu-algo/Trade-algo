const stocks = [
    { symbol: 'AAPL', spyWeightage: '6.5%' },
    { symbol: 'TSLA', spyWeightage: '5.3%' },
    { symbol: 'GOOGL', spyWeightage: '7.2%' },
    { symbol: 'MSFT', spyWeightage: '8.5%' },
    { symbol: 'AMZN', spyWeightage: '4.1%' },
    { symbol: 'NVDA', spyWeightage: '3.8%' },
    { symbol: 'GOOG', spyWeightage: '6.9%' }
];

const apiDataElement = document.getElementById('api-data');
const defaultDataElement = document.getElementById('default-data');
const lastUpdatedElement = document.getElementById('last-updated');
const apiErrorMessage = document.getElementById('api-error-message');
const submitButton = document.getElementById('submit');

let alphaVantageKey = '';
let finnhubKey = '';

// Update the last fetched time
function updateLastFetchedTime() {
    const currentDate = new Date();
    lastUpdatedElement.textContent = `Last Updated: ${currentDate.toLocaleString()}`;
}

// Fetch data from API
function fetchDataFromApi() {
    const url = `https://api.example.com/data`; // Replace with your actual API URL
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayApiData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            apiErrorMessage.style.display = 'block';
            apiDataElement.style.display = 'none';
            defaultDataElement.style.display = 'block';
        });
}

// Display data from API
function displayApiData(data) {
    apiDataElement.style.display = 'block';
    defaultDataElement.style.display = 'none';
    apiErrorMessage.style.display = 'none';
    
    let tableRows = '';
    stocks.forEach(stock => {
        const stockData = data[stock.symbol] || {};
        tableRows += `
            <tr>
                <td>${stock.symbol}</td>
                <td>${stockData.open || '-'}</td>
                <td>${stockData.prevClose || '-'}</td>
                <td>${stockData.currentPrice || '-'}</td>
                <td>${stock.spyWeightage || '-'}</td>
                <td>${stockData.rsi || '-'}</td>
                <td>${stockData.ema20 || '-'}</td>
                <td>${stockData.ema50 || '-'}</td>
            </tr>
        `;
    });
    apiDataElement.querySelector('tbody').innerHTML = tableRows;
}

// Fetch default data when no API data is available
function fetchDefaultData() {
    apiDataElement.style.display = 'none';
    defaultDataElement.style.display = 'block';
    apiErrorMessage.style.display = 'none';
    
    let tableRows = '';
    stocks.forEach(stock => {
        tableRows += `
            <tr>
                <td>${stock.symbol}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>${stock.spyWeightage || '-'}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
        `;
    });
    defaultDataElement.querySelector('tbody').innerHTML = tableRows;
}

// Event listener for the Submit button
submitButton.addEventListener('click', function() {
    alphaVantageKey = document.getElementById('alpha-key').value;
    finnhubKey = document.getElementById('finnhub-key').value;

    if (alphaVantageKey || finnhubKey) {
        fetchDataFromApi();
    } else {
        fetchDefaultData();
    }

    updateLastFetchedTime();
});

// Initial call to load default data
fetchDefaultData();
