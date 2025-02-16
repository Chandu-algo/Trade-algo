// Function to fetch data from APIs
function fetchDataFromAPI(apiURL, apiKey, source) {
    return new Promise((resolve, reject) => {
        fetch(`${apiURL}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(`${source} failed: ${error}`));
    });
}

// Process and display stock data
function displayData(data, source) {
    let tableContent = `
        <h3>MAG 7 Stocks (S&P 500) - ${source}</h3>
        <table border="1">
            <tr>
                <th>Symbol</th>
                <th>Open Price</th>
                <th>Previous Close</th>
                <th>Current Price</th>
                <th>Weightage in S&P 500</th>
            </tr>`;
    
    if (data) {
        data.forEach(stock => {
            tableContent += `
                <tr>
                    <td>${stock.symbol}</td>
                    <td>${stock.openPrice}</td>
                    <td>${stock.closePrice}</td>
                    <td>${stock.currentPrice}</td>
                    <td>${stock.weight}</td>
                </tr>`;
        });
    } else {
        tableContent += `
            <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>`;
    }

    tableContent += "</table>";
    document.getElementById('output').innerHTML = tableContent;
}

// Handle stock data based on provided API keys
function getStockData() {
    let alphaKey = document.getElementById('alpha-key').value;
    let finnhubKey = document.getElementById('finnhub-key').value;
    let apiData = [];

    // Attempt to fetch data from Alpha Vantage API if key is provided
    if (alphaKey) {
        fetchDataFromAPI("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL", alphaKey, "Alpha Vantage")
            .then(data => {
                apiData = processData(data);
                displayData(apiData, "Alpha Vantage");
                document.getElementById('last-updated').innerHTML = `Last Updated: ${new Date().toLocaleString()}`;
            })
            .catch(error => {
                document.getElementById('alerts').innerText = error;
                displayError();
            });
    }
    // If Alpha Vantage fails, attempt Finnhub API
    else if (finnhubKey) {
        fetchDataFromAPI("https://finnhub.io/api/v1/quote?symbol=AAPL", finnhubKey, "Finnhub")
            .then(data => {
                apiData = processData(data);
                displayData(apiData, "Finnhub");
                document.getElementById('last-updated').innerHTML = `Last Updated: ${new Date().toLocaleString()}`;
            })
            .catch(error => {
                document.getElementById('alerts').innerText = error;
                displayError();
            });
    }
    // If no API keys, display error message
    else {
        document.getElementById('alerts').innerText = "No API key provided. Please enter a valid API key.";
        displayError();
    }
}

// Error message when data cannot be fetched
function displayError() {
    let errorMessage = `
        <h3>MAG 7 Stocks (S&P 500) - Error</h3>
        <table border="1">
            <tr>
                <th>Symbol</th>
                <th>Open Price</th>
                <th>Previous Close</th>
                <th>Current Price</th>
                <th>Weightage in S&P 500</th>
            </tr>
            <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            </tr>
        </table>
    `;
    document.getElementById('output').innerHTML = errorMessage;
}

// Process data (mock data in this case)
function processData(data) {
    return [
        { symbol: 'AAPL', openPrice: '150.50', closePrice: '152.00', currentPrice: '151.20', weight: '6.5%' },
        { symbol: 'MSFT', openPrice: '280.00', closePrice: '285.00', currentPrice: '282.50', weight: '7.0%' },
        { symbol: 'GOOG', openPrice: '2700.00', closePrice: '2750.00', currentPrice: '2735.00', weight: '5.2%' },
        { symbol: 'AMZN', openPrice: '3400.00', closePrice: '3500.00', currentPrice: '3470.00', weight: '4.5%' },
        { symbol: 'TSLA', openPrice: '750.00', closePrice: '760.00', currentPrice: '755.00', weight: '5.8%' },
        { symbol: 'FB', openPrice: '350.00', closePrice: '355.00', currentPrice: '352.00', weight: '3.2%' },
        { symbol: 'NVDA', openPrice: '220.00', closePrice: '225.00', currentPrice: '223.00', weight: '4.0%' },
    ];
}

// Call function on load
getStockData();
