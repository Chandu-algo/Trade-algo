// Helper function to handle API response failure
function fetchDataFromAPI(apiURL, apiKey, source) {
    return new Promise((resolve, reject) => {
        fetch(`${apiURL}?apikey=${apiKey}`)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(`${source} failed: ${error}`));
    });
}

// Main function to get stock data
function getStockData() {
    let alphaKey = document.getElementById('alpha-key').value;
    let finnhubKey = document.getElementById('finnhub-key').value;

    let apiData = [];

    // Use the provided Alpha Vantage API Key if available
    if (alphaKey) {
        fetchDataFromAPI("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL", alphaKey, "Alpha Vantage")
            .then(data => {
                // Process the data if fetched successfully
                apiData = processData(data);
                displayData(apiData, "Alpha Vantage");
            })
            .catch(error => {
                document.getElementById('alerts').innerText = error;
                displayError();
            });
    }
    // Use Finnhub API Key if Alpha Vantage fails or no key is provided
    else if (finnhubKey) {
        fetchDataFromAPI("https://finnhub.io/api/v1/quote?symbol=AAPL", finnhubKey, "Finnhub")
            .then(data => {
                // Process the data if fetched successfully
                apiData = processData(data);
                displayData(apiData, "Finnhub");
            })
            .catch(error => {
                document.getElementById('alerts').innerText = error;
                displayError();
            });
    }
    // If no API keys are available, show error message
    else {
        document.getElementById('alerts').innerText = "No API key provided. Please enter a valid API key.";
        displayError();
    }
}

// Display data on webpage
function displayData(data, source) {
    let tableContent = `
        <h3>MAG 7 Stocks (S&P 500) - ${source}</h3>
        <table>
            <tr>
                <th>Symbol</th>
                <th>Open Price</th>
                <th>Previous Close</th>
                <th>Current Price</th>
                <th>Weightage in S&P 500</th>
            </tr>`;
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

    tableContent += "</table>";
    document.getElementById('output').innerHTML = tableContent;
}

// Error handling function to show empty table when data can't be fetched
function displayError() {
    let errorMessage = `
        <h3>MAG 7 Stocks (S&P 500) - Error</h3>
        <table>
            <tr>
                <th>Symbol</th>
                <th>Open Price</th>
                <th>Previous Close</th>
                <th>Current Price</th>
                <th>Weightage in S&P 500</th>
            </tr>
            <tr>
                <td>AAPL</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>6.5%</td>
            </tr>
            <tr>
                <td>MSFT</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>7.2%</td>
            </tr>
            <tr>
                <td>TSLA</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>5.8%</td>
            </tr>
        </table>
    `;
    document.getElementById('output').innerHTML = errorMessage;
}

// Call to fetch stock data initially
getStockData();

// Refresh data every 5 seconds
setInterval(getStockData, 5000);
