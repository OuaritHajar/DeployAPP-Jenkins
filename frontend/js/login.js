const login = async function () {
    try {
            // évènement click bouton du formulaire
            document.getElementById("btnSubmit").addEventListener('click', e => {
                
                // Récupère valeur inputs form
                let inputPassword = document.getElementById('inputPassword').value
                let inputEmail = document.getElementById('inputEmail').value

                // Post les données attendu à l'API
                fetch("http://localhost:3000/api/users/login", {
                    method: "POST",
                    body: JSON.stringify({

                        // objet contact tiré du forulaire
                        email: inputEmail ,
                        password: inputPassword
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                }, true)
                    .then(response => response.json())
                    .then(function (response) {
                        
                        console.log(response.token);
                        localStorage.setItem('token', response.token);

                        window.location.href = "posts.html"

                    })
                    .catch(function (error) {
                        console.error(error)
                    }); 
            })
    } catch (e) {
        console.error(e)
    }
}
login()