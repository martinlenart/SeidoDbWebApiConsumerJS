//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//https://openjavascript.info/2022/01/03/using-fetch-to-make-get-post-put-and-delete-requests

//Let's use fetch to access and modify a database through a WebApi using GET, POST, PUT, DELETE requests
//Le'ts use my WebApi generating random customers and orders, using a mySQL database version called MariaDb

const urlBase = "https://localhost:44340";
const urlID = urlBase + "/id";
const urlData = urlBase + "/api/Customers";

async function myFetch(url, method = null, body = null) {
  try {

    let res = await fetch(url, {
      method: method ?? 'GET',
      headers: { 'content-type': 'application/json' },
      body: body ? JSON.stringify(body) : null
    });

    if (res.ok) {

      console.log("Request successful");

      if (method == 'PUT' || method == 'DELETE')
        //request is successful, but WebAPI is not send a response, so I return the body which represenst the effect on the database
        return body;

      //get the data from server
      let data = await res.json();
      return data;
    }
    else {

      //typcially you would log an error instead
      console.log(`Failed to recieved data from server: ${res.status}`);
      alert(`Failed to recieved data from server: ${res.status}`);
    }
  }
  catch (err) {

    //typcially you would log an error instead
    console.log(`Failed to recieved data from server: ${err.message}`);
    alert(`Failed to recieved data from server: ${err.message}`);
  }
}

//Lets use myFetch. As it is an async method and I cannot have await at top level, I need to make trick.
//See analogy on making in C# main async
//I make main as an asych arrow function with immediate execution of syntax, (async() => {})();

(async () => {

  //Here I write all the code to be executed at script top level, c# main level

  //Test Get WebApi ID
  console.log("Testing Reading WebApi ID");
  let data = await myFetch(urlID);
  console.log(data);

  //Test GET all customers  https://ws6.seido.se/api/Customers
  console.log("Test GET all customers and list the 10 first");
  data = await myFetch(urlData);
  if (data) {

    //List the first 10 customers
    data.slice(0, 10).forEach(element => { console.log(element) });

  }

  //Test GET specific Customer  https://ws6.seido.se/api/Customers/{custId}
  //Make url to get first customer list above
  console.log("Test GET specific Customer");
  data = await myFetch(`${urlData}/${data[0].customerID}`);
  if (data) {

    console.log(data);
  }

  //Test POST to create a new specific Customer  https://ws6.seido.se/api/Customers
  //create a new customer with an order, I just use defaults from Swagger
  const newCust = {
    "customerID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "orders": [
      {
        "orderID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "customerID": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "nrOfArticles": 0,
        "value": 0,
        "freight": 0,
        "deliveryDate": "2022-08-03T09:21:51.762Z"
      }
    ],
    "firstName": "string",
    "lastName": "string",
    "adress": "string",
    "zipCode": 0,
    "city": "string",
    "country": "string",
    "birthDate": "2022-08-03T09:21:51.762Z"
  };

  console.log("Test POST to create a new specific Customer");
  data = await myFetch(urlData, 'POST', newCust);
  if (data) {

    console.log(data);
  }

  //Test PUT to change the details of newly created Customer  https://ws6.seido.se/api/Customers/{custId}
  console.log("Test PUT to change the details of newly created Customer");
  newCust.firstName = 'Martin';
  newCust.lastName = 'Lenart';
  data = await myFetch(`${urlData}/${newCust.customerID}`, 'PUT', newCust);
  if (data) {

    console.log(data);
  }
  
  //let's double check the PUT request by really reading the Database
  console.log("let's double check the PUT request by really reading the Database");
  data = await myFetch(`${urlData}/${newCust.customerID}`);
  if (data) {

    console.log(data);
  }

  //Test DELETE to remove the newly created (and changed) customer from the database
  console.log("Test DELETE to remove the newly created (and changed) customer from the database");
  data = await myFetch(`${urlData}/${newCust.customerID}`, 'DELETE');
  if (data) {

    console.log(data);
  }

  //let's double check that the customer is indeed deleted
  //Below should give an error
  //data = await myFetch(`${url}/${newCust.customerID}`);  //should give an error!

})();

