// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
      db.collection('datasets').onSnapshot(snapshot => {
        setupData(snapshot.docs, user)
        setupUI(user);
      }, err => {
        console.log(err.message);
      });
    } else {
        setupData([]);
        setupUI();
    }
});

// create new application
const addApplication = document.querySelector('#add-app-form');
addApplication.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('datasets').add({
    user: auth.currentUser.uid,
    title: addApplication['title'].value,
    ingredients: addApplication['ingredients'].value
  }).then(() => {
    let clientID = "application-registerer";
    let uri = "https://app.getpostman.com/oauth2/callback";
    let basic = "YXBwbGljYXRpb24tcmVnaXN0ZXJlcjpkdWJYZ2tXZDJfQkppMUNOdUhIR2swaEc0Sl83RGZ2VERPcEhhZ3lTa3dQQ0l2eFc2Um53RUxGVw=="

    fetch(`https://account.thethingsnetwork.org/users/token`,{
      method: "post",
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${basic}`
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: "KFZ3s7aZ6BxnbsGZ4xhcO6xTmxWtK5Oxc5RRMRJiNwI",
        redirect_uri: `${uri}`
      }) 
    }).then(res => res.json())
    .then(data => {      
      let refresh_token = data["refresh_token"];
      let access_token = data["access_token"];

      // update db with refresh token
      updateRefreshToken(refresh_token);

      fetch(`https://account.thethingsnetwork.org/applications`,{
        method: "post",
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          id: "unique_name_of_app",
          name: "Some kind of description for the app"
        }) 
      }).then(response => response.json())
      .then(d => {
        console.log(d) //was the creation of a new app successful?????????
      });
    })
  }).then(() => {
    // reset form
    addApplication['title'].value = '';
    addApplication['ingredients'].value = '';
  }).catch(err => {
    console.log(err.message);
  })
})

const updateRefreshToken = (token) => {
  db.collection('refresh-token').doc('rtoken').update({
    "token": `${token}`
  })
}

document.getElementById("test-btn").addEventListener('click', () => {
  updateRefreshToken("newToken");
})

// delete a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', (e) => {

    if(e.target.tagName === 'I') {
        const id = e.target.getAttribute('data-id');
        db.collection('datasets').doc(id).delete();
    }
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  console.log(email);
  console.log(password);

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user);

    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
      console.log('user signed out');
  });
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);

    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});