const stocks = [
    { symbol: 'AAPL' },
    { symbol: 'TSLA' },
    { symbol: 'GOOGL' }
];

const apiDataElement = document.getElementById('api-data');
const emptyDataElement = document.getElementById('empty-data');
const lastUpdatedElement = document.getElementById('last-updated');
const apiErrorMessage = document.getElementById('api-error-message');
const submitButton = document.getElementById('submit');
const refreshButton = document.getElementById('refresh');

let alphaVantageKey = '';
let finnhubKey = '';

function updateLastFetchedTime() {
    const currentDate = new Date();
    lastUpdatedElement.textContent = `Last Updated: ${currentDate.toLocaleString()}`;
}

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
            emptyDataElement.style.display = 'block';
        });
}

function displayApiData(data) {
    apiDataElement.style.display = 'block';
    emptyDataElement.style.display = 'none';
    apiErrorMessage.style.display = 'none';
    
    let tableRows = '';
    stocks.forEach(stock => {
        const stockData = data[stock.symbol] || {};
        tableRows += `
            <tr>
                <td>-</td>
                <td>${stock.symbol}</td>
                <td>${stockData.open || '-'}</td>
                <td>${stockData.prevClose || '-'}</td>
                <td>${stockData.currentPrice || '-'}</td>
                <td>${stockData.spyWeightage || '-'}</td>
                <td>${stockData.rsi || '-'}</td>
                <td>${stockData.ema20 || '-'}</td>
                <td>${stockData.ema50 || '-'}</td>
            </tr>
        `;
    });
    apiDataElement.querySelector('tbody').innerHTML = tableRows;
}

submitButton.addEventListener('click', () => {
    alphaVantageKey = document.getElementById('alpha-key').value;
    finnhubKey = document.getElementById('finnhub-key').value;

    if (alphaVantageKey || finnhubKey) {
        fetchDataFromApi();
    } else {
        apiErrorMessage.style.display = 'block';
        apiDataElement.style.display = 'none';
        emptyDataElement.style.display = 'block';
    }
});

refreshButton.addEventListener('click', () => {
    window.location.reload();
});

// Set initial last updated time
updateLastFetchedTime();

// Set interval to refresh data every 5 seconds
setInterval(() => {
    updateLastFetchedTime();
}, 5000);
