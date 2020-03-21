const recipes = document.querySelector('.recipes');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedInUser = document.querySelector('.user-email');

// setup ui
const setupUI = (user) => {
  if(user) {
    // display logged in
    const html = `
      <p>Logged in as ${user.email}</p>
    `;
    loggedInUser.innerHTML = html;

    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // remove account info
    loggedInUser.innerHTML = '';
    // toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}

// setup datasets
const setupData = (data, user) => {

  if(data.length) {
    let html = '';
    data.forEach(doc => {
      const data = doc.data();
      const id = doc.id;
      if(data.user == user.uid) {
        const li = `
        <div class="card-panel recipe white row" data-id=${id}>
          <img src="/img/dish.png" alt="recipe thumb">
           <div class="recipe-details">
             <div class="recipe-title">${data.title}</div>
             <div class="recipe-ingredients">${data.ingredients}</div>
           </div>
           <div class="add-device">
              <a href="/pages/add-device.html" class="btn-link btn-small">Add Device</a>
           </div>
           <div class="recipe-delete">
             <i class="material-icons" data-id=${id}>delete_outline</i>
           </div>
        </div>
        `;
        html += li;
      }
    });

    recipes.innerHTML = html;
  } else {
    recipes.innerHTML = '<h1 class="center-align">Login to view data</h1>';
  }

  
}

// set up components
document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});

  // modal set up
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
});

// render datasets
// const renderRecipe = (data, id) => {

//   const html = `
//     <div class="card-panel recipe white row" data-id=${id}>
//       <img src="/img/dish.png" alt="recipe thumb">
//       <div class="recipe-details">
//         <div class="recipe-title">${data.title}</div>
//         <div class="recipe-ingredients">${data.ingredients}</div>
//       </div>
//       <div class="recipe-delete">
//         <i class="material-icons" data-id=${id}>delete_outline</i>
//       </div>
//     </div>
//   `;

//   recipes.innerHTML += html;

// };

// remove recipe from DOM
const removeRecipe = (id) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
};