 
const kiiras = document.querySelector("div");

fetch('https://surveys-5jvt.onrender.com/api/phones/')
.then(response => {
if (!response.ok) {new Error('Network response was not ok');
}
return response.json();
}
)
.then(users => {
console.log(users);
kiiras.textContent  = JSON.stringify(users);

}
)
.catch(error => {
console.error('There was a problem with the fetch operation:', error);
}
);
 
