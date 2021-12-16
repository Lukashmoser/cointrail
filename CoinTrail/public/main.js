function testFetch(){
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    Authorization: 'Bearer 29d41298-b14f-4f99-be93-7c164af613a7'
  };
  
  fetch("https://api.coincap.io/v2/assets/bitcoin", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

    fetch("https://api.coincap.io/v2/assets/bitcoin/history?interval=d1", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}