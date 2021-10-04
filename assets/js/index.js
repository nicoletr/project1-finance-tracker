const listUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
const coinIdUrl ="https://api.coingecko.com/api/v3/coins/"
const submitBtn = document.getElementById("submit-btn")
const dropdown = document.getElementById("list-dropdown")
const currencyAmount = document.getElementById("amount-input")
const savedPortfolio = document.getElementById("saved-portfolio")



// Dropdown Javascript
// Create a select box dropdown

dropdown.length = 0;
// Set the default option on page load
let defaultOption = document.createElement('option');
defaultOption.text = 'Select Your Cryptocurrency';

dropdown.add(defaultOption);
dropdown.selectedIndex = 0;
// Fetch the top 20 cryptocurrencies by market cap
fetch(listUrl)  
.then(  
  function(response) {  
    if (response.status !== 200) {  
      console.warn('Looks like there was a problem. Status Code: ' + 
        response.status);  
      return;  
    }

    // Retreive the name and the coin ID from the json response  
    response.json().then(function(data) {  
      let option;
    // Loop to add each coin as a dropdown option, with the coin ID assigned as the option value
    for (let i = 0; i < data.length; i++) {
        option = document.createElement('option');
        option.text = data[i].name;
        option.value = data[i].id;
        dropdown.add(option);
    }  
    });  
    
  }  
)  
.catch(function(err) {  
  console.error('Fetch Error -', err);  
});

// Function to add a new portfolio item when the submit button is pressed
function addPortfolioItem(coinID, coinAmount) {
  fetch(coinIdUrl + coinID)
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.warn('Looks like there was a problem. Status Code: ' + 
          response.status);  
        return;  
      }
  
      // Examine the text in the response  
      response.json().then(function(data) {  

        var newCoin = document.createElement("tr")
        var newName = document.createElement("td")
        var newAmount = document.createElement("td")
        var newPrice = document.createElement("td")
        var newValue = document.createElement("td")

        newName.innerHTML = data.name
        newAmount.innerHTML = coinAmount
        newPrice.innerHTML = data.market_data.current_price.usd
        newValue.innerHTML = (data.market_data.current_price.usd * coinAmount)

        savedPortfolio.appendChild(newCoin)
        newCoin.appendChild(newName)
        newCoin.appendChild(newAmount)
        newCoin.appendChild(newPrice)
        newCoin.appendChild(newValue)

        console.log(data)
        console.log(coinAmount)  
        
      });  
      
    }  
  )  
  .catch(function(err) {  
    console.error('Fetch Error -', err);  
  });
  console.log
}

// When the user clicks submit, get currency details and amount
submitBtn.addEventListener("click", function (event) {
  event.preventDefault()
  currentId = document.getElementsByTagName("option")[dropdown.selectedIndex].value
  currentAmnt = currencyAmount.value
  // console.log(currentId)
  // console.log(currencyAmount.value)
  addPortfolioItem(currentId, currentAmnt)
});


// // Testing API URL code below;
fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
  )
.then(function (response) {
    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(function (data) {
    // DO THINGS WITH TEH DATA
    console.log(data)
});