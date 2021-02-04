
const affichePosts = async () => {
    try {

        // récupère le token 
        var tokenAuthentificationPasDuToutSafe = localStorage.getItem('token');

        const articles = document.getElementById('allPosts');
        const lienArticle = document.getElementById('lien-post');

        // On récupère les données du serveur
        fetch('http://localhost:3000/api/posts/',{
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + tokenAuthentificationPasDuToutSafe
            }})
        .then(function(response) {
            if (!response.ok) {
                throw new Error(`erreur HTTP! statut: ${response.status}`);
            }
            return response.json();
        }).then(function(response) {

            // boucle qui affiche la liste des produits
            for (post of response) {
                articles.innerHTML += `
                    <article>
                        <div class="post">
                            <p class="author">posté par : ${post.users}</p>
                            <a href="post.html?postId=${post.id}" id="lien-post">
                                <h2>${post.title}</h2>
                                <p class="description">${post.description}</p>
                                <img src="img/image-post.jpg" alt="premier post poto" class="image-post">
                            </a>
                            <div class="row interaction-post">
                                <p><a href="*" class="like">Likes</a>: ${post.like} </p>
                                <p class="spacer">-</p>
                                <p><a href="*" class="commentaire"> Commentaire </a>: ${post.comment}</p>
                            </div>
                            <div class="seperate"></div>
                        </div>
                    </article>
                    `;
            }

        }).catch(err => console.log(err));


    }
    catch (e) {
        console.log('tu crains');
        console.error(e);
    }
}

affichePosts();








//const index = async function () {
//    try {
//    
//            // évènement click bouton du formulaire
//            document.getElementById("btn-add-post").addEventListener('click', e => {
//
//
//
//                // Récupère valeur inputs form
//                let inputLastName = document.getElementById('inputLastName').value
//                let inputFirstName = document.getElementById('inputFirstName').value
//                let inputPassword = document.getElementById('inputPassword').value
//                let inputEmail = document.getElementById('inputEmail').value
//
//                // Post les données attendu à l'API
//                fetch("http://localhost:3000/api/users/signup", {
//                    method: "POST",
//                    body: JSON.stringify({
//                        // objet contact tiré du forulaire
//                        
//                            first_name:inputFirstName,
//                            last_name: inputLastName ,
//                            email: inputEmail ,
//                            password: inputPassword
//                        
//                    }),
//                    headers: {
//                        "Content-type": "application/json; charset=UTF-8"
//                    }
//                }, true)
//                    .then(response => response.json())
//                    .then(function (response) {
//
//                        window.location.href = "login.html"
//                        console.log(response)
//                    })
//                    .catch(function (error) {
//                        console.error(error)
//                    });
//
//                
//            })
//        
//    } catch (e) {
//        console.error(e)
//    }
//}
//
//index()
//console.log(localStorage)