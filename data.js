loadData();

function generateData(){
  window.data = {
    coffee: 0,
    totalCPS: 0,
    producers: [
      {
        id: 'chemex',
        price: 10,
        unlocked: false,
        cps: 1,
        qty: 0,
        upgrades: {name: 'filter', bonus: 1, price: 1000, description: '2x CPS from all Chemex', unlocked: false}
      },
      {
        id: 'french_press',
        price: 50,
        unlocked: false,
        cps: 2,
        qty: 0,
        upgrades: {name: 'plunger', bonus: .5, price: 5000, description: '50% More CPS from all French Press', unlocked: false}
      },
      {
        id: 'mr._coffee',
        price: 100,
        unlocked: false,
        cps: 5,
        qty: 0,
        upgrades: undefined
      },
      {
        id: 'ten_cup_urn',
        price: 500,
        unlocked: false,
        cps: 10,
        qty: 0,
        upgrades: undefined
      },
      {
        id: 'espresso_machine',
        price: 1000,
        unlocked: false,
        cps: 20,
        qty: 0,
        upgrades: {name: 'turbo', bonus: .3, price: 20000, description: '30% More CPS from all Espresso Machines', unlocked: false}
      },
      {
        id: 'ten_gallon_urn',
        price: 5000,
        unlocked: false,
        cps: 50,
        qty: 0,
        upgrades: undefined
      },
      {
        id: 'coffeeshop',
        price: 10000,
        unlocked: false,
        cps: 75,
        qty: 0,
        upgrades: {name: 'franchise', bonus: .6, price: 50000, description: '60% More CPS from all Coffee Shops', unlocked: false}
      },
      {
        id: 'coffee_factory',
        price: 50000,
        unlocked: false,
        cps: 100,
        qty: 0,
        upgrades: undefined
      },
      {
        id: 'coffee_fountain',
        price: 100000,
        unlocked: false,
        cps: 200,
        qty: 0,
        upgrades: undefined
      },
      {
        id: 'coffee_river',
        price: 500000,
        unlocked: false,
        cps: 500,
        qty: 0,
        upgrades: undefined
      },
      {
        id: 'coffee_ocean',
        price: 1000000,
        unlocked: false,
        cps: 1000,
        qty: 0,
        upgrades: {name: 'ocean_wild_life', bonus: .4, price: 2000000, description: '40% More CPS from all Coffee Oceans', unlocked: false}
      },
      {
        id: 'coffee_planet',
        price: 5000000,
        unlocked: false,
        cps: 2000,
        qty: 0,
        upgrades: undefined
      }
    ]
  };
    console.log(window.data)
  }

  function loadData(){
    const loadedData = localStorage.getItem('coffee_clicker_data')
    if(loadedData === null || loadedData === 'undefined'){
      generateData();
    }else{
      window.data = JSON.parse(loadedData);
    }
  }