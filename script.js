/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/
function updateCoffeeView(coffeeQty) {
  document.querySelector('#coffee_counter').innerText = coffeeQty;
  
}

function clickCoffee(data) {
  data.coffee++; 
  updateCoffeeView(data.coffee)
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(e => {
    if(e.price/2 <= coffeeCount)e.unlocked = true;
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter( e => e.unlocked )
}

function makeDisplayNameFromId(id) {
  id = id.replaceAll('_',' ');

  return Array.from(id).map( (e,i,arr) => {
    if(i===0)return e.toUpperCase();
    if(arr[i-1] === ' ')return e.toUpperCase();
    return e;
  }).join('');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const upgrades = producer.upgrades;
  let sellButtonDisplay = 'none'
  if(producer.qty>0)sellButtonDisplay = 'block'

  let html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
    <button type="button" style="display: ${sellButtonDisplay}" id="sell_${producer.id}">Sell</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;

  if(upgrades.length>0){
    html = html.concat(
    `
    <div class="producer-upgrades">
      <fieldset>
        <legend>Upgrades</legend>
      ${addUpgradeButtons(upgrades)}
      </fieldset>
    </div>
    `);
  }
  
  function addUpgradeButtons(upgradesArr){
    return upgradesArr.reduce((prev,e) => prev + `<button class="upgrades-button" type="button"
    ${disableUpgradeButton(e)}
    id="upgrade_${e.name}">${makeDisplayNameFromId(e.name)}${addCheckMark(e.unlocked)}</button>`,"");
  }

  function addCheckMark(bool){
    if(bool)return `✔️`;
    return ``
  }

  function disableUpgradeButton(upgrade){
    if(upgrade.unlocked)return 'disabled'
  }
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while(parent.firstChild)parent.removeChild(parent.firstChild)
}

function renderProducers(data) {
  unlockProducers(data.producers,data.coffee);
  const unlockedProducers = getUnlockedProducers(data)
  const producerDiv = document.getElementById("producer_container");
  deleteAllChildNodes(producerDiv);
  unlockedProducers.forEach( e => producerDiv.appendChild(makeProducerDiv(e)))

}

function showSellButton(producerId){
  let element = document.getElementById('sell_'+producerId)
  element.style = 'display: block'
}

function hideSellButton(producerId){
  let element = document.getElementById('sell_'+producerId)
  element.style = 'display: none'
}
/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  return data.producers.filter( e => e.id === producerId)[0];
}

function canAffordProducer(data, producerId) {
  return data.coffee >= getProducerById(data,producerId).price
}

function updateCPSView(cps) {
  document.getElementById('cps').innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice*1.25);
}

function previousPrice(currentPrice){
  return Math.ceil(currentPrice/1.25);
}

function attemptToBuyProducer(data, producerId) {
  const producerBeingBrought = getProducerById(data,producerId);

  if(canAffordProducer(data,producerId)){
    producerBeingBrought.qty++;
    data.coffee -= producerBeingBrought.price;
    producerBeingBrought.price = updatePrice(producerBeingBrought.price)
    data.totalCPS += producerBeingBrought.cps;
    return true
  }

  return false
}

function attemptToSellProducer(data,producerId){
  const producerBeingSold = getProducerById(data,producerId);

  if(producerBeingSold.qty>0){
    producerBeingSold.qty--;
    producerBeingSold.price = previousPrice(producerBeingSold.price)
    data.coffee += producerBeingSold.price;
    data.totalCPS -= producerBeingSold.cps;
    return true
  }
  return false
}

function producerButtonClick(event,data){
  if(event.target.id.substring(0,4)==='buy_'){
    buyButtonClick(event, data);
  }
  else if(event.target.id.substring(0,5)==='sell_'){
    sellButtonClick(event, data);
  }
  else if(event.target.id.substring(0,8)==='upgrade_'){
    upgradeButtonClick(event,data);
  }
}

function buyButtonClick(event, data) {

  if(event.target.tagName === 'BUTTON'){
    const producerBeingBroughtID = event.target.id.substring(4)
    if(attemptToBuyProducer(data, producerBeingBroughtID)){
      updateCPSView(data.totalCPS);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      showSellButton(producerBeingBroughtID);
    }else{
      window.alert('Not enough coffee!')
    }
  }
}

function sellButtonClick(event, data) {
  if(event.target.tagName === 'BUTTON'){
    const producerBeingSoldID = event.target.id.substring(5)
    if(window.confirm(`Sell 1 ${makeDisplayNameFromId(producerBeingSoldID)}?`)){

    if(attemptToSellProducer(data,producerBeingSoldID)){
      updateCPSView(data.totalCPS);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      if(getProducerById(data,producerBeingSoldID).qty<1)hideSellButton(producerBeingSoldID);
    }else{
      window.alert('You do not have this producer to sell!');
    }
  }
  }
}

function getProducerByUpgradeName(data,upgradeName){
  return data.producers.filter( e => e.upgrades.length>0)
  .filter(h => h.upgrades.some(j => j.name===upgradeName))[0];

}

function getUpdrageByName(data,upgradeName){
  return getProducerByUpgradeName(data,upgradeName).upgrades
    .filter( e => e.name === upgradeName)[0];
}

function upgradeButtonClick(event,data){
  if(event.target.tagName === 'BUTTON'){
    const upgradeName = event.target.id.substring(8);
    //const producerBeingUpgraded = getProducerByUpgradeName(data,upgradeName)
    const upgradeBeingUnlocked = getUpdrageByName(data,upgradeName)
    console.dir(upgradeBeingUnlocked)

    if(data.coffee>=upgradeBeingUnlocked.price){

      if(upgradeBeingUnlocked.unlocked === false){
        upgradeBeingUnlocked.unlocked = true;
        data.coffee -= upgradeBeingUnlocked.price;
      }else{
        window.alert('This upgrade is already unlocked!')
      }

    }else{
      window.alert('Not enough cofee!')
    }
    
    
  }
}

function tick(data) {
  data.coffee += data.totalCPS
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

//function to save the data
function saveData(){
  localStorage.setItem('coffee_clicker_data', JSON.stringify(window.data))
  console.log('data has been saved!')
}
//stores coffee data every 10 seconds
setInterval(() => {
  saveData();
}, 10000);

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    producerButtonClick(event, data);
  });


  //saves the data once the window is closed as well
  //  *In case the window is closed in between the 10 second gaps of autosave
  window.addEventListener('unload', () => saveData());

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);

  //update the coffee view from loaded/generated data 
  updateCoffeeView(data.coffee);

  //update the cps view from loaded/generated data
  updateCPSView(data.totalCPS);
 
  //render the coffee producers from loaded/generated data
  renderProducers(data);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
