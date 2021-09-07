console.log(window.location.hostname.includes("localhost")); //eslint-disable-line
const miformulario = document.querySelector("form"); //eslint-disable-line

const url = window.location.hostname.includes("localhost") //eslint-disable-line
  ? "http://localhost:8080/api/auth/"
  : "https://rest-server-cafe-romel.herokuapp.com/api/auth/";

miformulario.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const formData = {};

  for (const el of miformulario.elements) {
    if (el.name.length > 0) formData[el.name] = el.value;
  }
  console.log(formData);

  fetch(url + "login", {//eslint-disable-line
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then(({msg,token}) => {
      if (!token) {
        // alert(msg); //eslint-disable-line
        Swal.fire({//eslint-disable-line
            icon:"error",
            title:"Oops hubo un error",
            text:msg
        });
      }else{
        Swal.fire({//eslint-disable-line
            icon: "success",    
            title:"Todo correcto",
            text:"Logueado coorrectamente"
        });
    
        localStorage.setItem("token",token); //eslint-disable-line
        window.location = "chat.html";//eslint-disable-line
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

function onSignIn(googleUser) {//eslint-disable-line
  const profile = googleUser.getBasicProfile(); //eslint-disable-line
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  // console.log(id_token)

  const data = {
    id_token,
  };

  fetch(url + "google", {//eslint-disable-line
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(({ token }) => {
      localStorage.setItem("token", token); //eslint-disable-line
      window.location = "chat.html";//eslint-disable-line
    })
    .catch(console.log);
}

function signOut() { //eslint-disable-line
  var auth2 = gapi.auth2.getAuthInstance(); //eslint-disable-line
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
}
