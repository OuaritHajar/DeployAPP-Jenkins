

const panier = async function () {
    try {

            // évènement click bouton du formulaire
            document.getElementById("btnCreate").addEventListener('click', e => {
                //e.preventDefault;
                // Récupère valeur inputs form
                let inputTitle = document.getElementById('inputTitle').value;
                let inputDescription = document.getElementById('inputDescription').value;
                let inputImg_url = document.getElementById('inputImg_url').value;
                console.log(inputTitle);

                ////regex formulaire
                //let regexInputLastName = /^[A-Za-zÀ-ÿ ,.'-]+$/
                //let regexInputFirstName = /^[a-zÀ-ÿ ,.'-]+$/i
                //let regexInputAdress = /^[a-zA-Z0-9\s,.'-]{3,}$/i
                //let regexInputCity = /^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$/i
                //let regexInputMail = /^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]­{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$/
//
                //// fonction verifier les inputs
                //function verifInput(regex, input) {
                //    if (regex.test(input)) {
                //        return true;
                //    } else {
                //        alert('Formulaire invalid');
                //        // ajouter une class en css pour afficher l'erreur
                //        const div = document.createElement('div');
                //        div.className = 'erreur-formulaire';
                //        // on enleve l'écoute
                //        document.getElementById("btnSubmit").removeEventListener('click')
                //    }
                //}
//
                //// Vérifie les inputs
                //if (verifInput(regexInputLastName, inputLastName)
                //    && verifInput(regexInputFirstName, inputFirstName)
                //    && verifInput(regexInputAdress, inputAddress)
                //    && verifInput(regexInputCity, inputCity)
                //    && verifInput(regexInputMail, inputEmail) ){
//
                //    // récupère les ID du tableau de produits commandé
                //    const productArray = JSON.parse(localStorage.getItem('products'))
                //    let products = productArray.map(product => product.id);
                //    console.log(products)

                    // Post les données attendu à l'API
                    fetch("http://localhost:3000/api/posts/", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        body: JSON.stringify({
          
                            title: inputTitle,
                            description: inputDescription,
                            img_url: inputImg_url,
                            
                        })
                    }, true)
                        .then(response => response.json())
                        .then(function (response) {
                            //sauvegarde l'orderId
                            console.log(response)


                            console.log(userId);
                        })
                        .catch(function (error) {
                            console.error(error)
                        });
                }
            )}
     catch (e) {
        console.error(e)
    }
}

panier()
console.log(localStorage)