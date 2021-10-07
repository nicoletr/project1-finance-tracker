const listUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
const coinIdUrl ="https://api.coingecko.com/api/v3/coins/"
const submitBtn = document.getElementById("submit-btn")
const refreshBtn = document.getElementById("refresh-btn")
const clearBtn = document.getElementById("clear-btn")
const dropdown = document.getElementById("list-dropdown")
const currencyAmount = document.getElementById("amount-input")
const savedPortfolio = document.getElementById("saved-portfolio")
const tableHeadings = document.getElementById("table-headings")
const grandTotal = document.getElementById("total")

var localPortfolio = JSON.parse(localStorage.getItem("portfolioArray")) || []

// Dropdown Javascript
// Create a select box dropdown
dropdown.length = 0
// Set the default option on page load
let defaultOption = document.createElement('option')
defaultOption.text = 'Select Your Cryptocurrency'
dropdown.add(defaultOption)
dropdown.selectedIndex = 0
// Fetch the top 20 cryptocurrencies by market cap
fetch(listUrl)  
.then(  
  function(response) {  
    if (response.status !== 200) {  
      console.warn('Looks like there was a problem. Status Code: ' + 
        response.status)  
      return  
    }
    // Retreive the name and the coin ID from the json response  
    response.json().then(function(data) {  
      let option
    // Loop to add each coin as a dropdown option, with the coin ID assigned as the option value
    for (let i = 0; i < data.length; i++) {
        option = document.createElement('option')
        option.text = data[i].name
        option.value = data[i].id
        dropdown.add(option)
    }  
    })  
  }  
)  
.catch(function(err) {  
  console.error('Fetch Error -', err) 
})

// Function to prepopulate the table with coins saved in localStorage
async function populateTable() { 
  // Clear the table before re-adding the elements
  deleteRows()
  // Loop through the local storage and retrieve information for each coin and create variable
  for (i = 0; i < localPortfolio.length; i++) {
    var tableCoinId = localPortfolio[i].coinId
    var tableName = localPortfolio[i].name
    var tableAmount = localPortfolio[i].amount
    var tablePrice = 0
    var tableValue = 0
    // Refresh the current price of the coin
    await fetch(coinIdUrl + tableCoinId)
    .then(  
      // Use async & await to wait for response of each fetch before proceeding with loop
      async function(response) {  
        if (response.status !== 200) {  
          console.warn('Looks like there was a problem. Status Code: ' + 
            response.status)  
          return  
        }
        // Discover new price and value of each coin 
        await response.json().then(function(data) {  
          tablePrice = data.market_data.current_price.usd
          tableValue = Math.round((tablePrice * tableAmount) * 100) / 100
          // Variables to create new elements
          var newCoin = document.createElement("tr")
          var newName = document.createElement("td")
          var newAmount = document.createElement("td")
          var newPrice = document.createElement("td")
          var newValue = document.createElement("td")
          // Fill variables with localStorage data and fresh API response
          newName.innerHTML = tableName
          newAmount.innerHTML = tableAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          newPrice.innerHTML = tablePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          newValue.innerHTML = tableValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          // Append the table
          savedPortfolio.appendChild(newCoin)
          newCoin.appendChild(newName)
          newCoin.appendChild(newAmount)
          newCoin.appendChild(newPrice)
          newCoin.appendChild(newValue) 
        })   
      }  
    )  
    .catch(function(err) {  
      console.error('Fetch Error -', err)  
    })

  }
}
// Populate the table with localStorage on page load
populateTable()

// Event listener for refresh button
refreshBtn.addEventListener("click", function (event) {
  event.preventDefault()
  populateTable()
})

// Event listener for clear button
clearBtn.addEventListener("click", function (event) {
  event.preventDefault()
  localStorage.clear()
  localPortfolio = []
  deleteRows()
})

// Function to delete portfolio table rows
function deleteRows() {
  var rowCount = savedPortfolio.rows.length
  for (var i = rowCount - 1; i > 0; i--) {
    savedPortfolio.deleteRow(i)  }
}

// Function to add a new portfolio item when the submit button is pressed
function addPortfolioItem(coinID, coinAmount) {
  fetch(coinIdUrl + coinID)
  .then(  
    function(response) {  
      if (response.status !== 200) {  
        console.warn('Looks like there was a problem. Status Code: ' + 
          response.status)  
        return  
      }
  
      // Examine the text in the response  
      response.json().then(function(data) {  
        // Variables to create new elements
        var newCoin = document.createElement("tr")
        var newName = document.createElement("td")
        var newAmount = document.createElement("td")
        var newPrice = document.createElement("td")
        var newValue = document.createElement("td")
        // Fill variables with API response
        newName.innerHTML = data.name
        newAmount.innerHTML = coinAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        newPrice.innerHTML = data.market_data.current_price.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        newValue.innerHTML = (Math.round((data.market_data.current_price.usd * coinAmount) * 100) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
        // Append the table
        savedPortfolio.appendChild(newCoin)
        newCoin.appendChild(newName)
        newCoin.appendChild(newAmount)
        newCoin.appendChild(newPrice)
        newCoin.appendChild(newValue) 
        // Set new coin details to local storage
        var newItem = {
          "name": newName.innerHTML,
          "amount": newAmount.innerHTML,
          "price": newPrice.innerHTML,
          "value":  newValue.innerHTML,
          "coinId": coinID
        }
        // Push new item into the localPortfolio object
        localPortfolio.push(newItem)
        // Set localPortfolio to localStorage
        localStorage.setItem("portfolioArray", JSON.stringify(localPortfolio))
      })    
    }  
  )  
  .catch(function(err) {  
    console.error('Fetch Error -', err)  
  })
}

// When the user clicks submit, get currency details and amount
submitBtn.addEventListener("click", function (event) {
  event.preventDefault()
  currentId = document.getElementsByTagName("option")[dropdown.selectedIndex].value
  currentAmnt = currencyAmount.value
  // console.log(currentId)
  // console.log(currencyAmount.value)
  addPortfolioItem(currentId, currentAmnt)
})


// // // Testing API URL code below;
// fetch(
//     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false"
//   )
// .then(function (response) {
//     if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`)
//     }
//     return response.json()
// })
// .then(function (data) {
//     // DO THINGS WITH TEH DATA
//     console.log(data)
// })