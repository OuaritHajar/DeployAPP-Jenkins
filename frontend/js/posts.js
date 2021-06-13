
const affichePosts = async () => {
    try {

        // récupère le token 
        var tokenAuthentificationPasDuToutSafe = localStorage.getItem('token');
        const articles = document.getElementById('allPosts');


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
            console.log(response)

            // boucle qui affiche la liste des produits
            for (post of response.post) {
                
                articles.innerHTML += `
                <article>
                    <div class="post">
                        <p class="author">posté par : <a href="profil.html?userId=${response.user.id}">${response.user.first_name} ${response.user.last_name}</a></p>
                        <a href="post.html?postId=${post.id}" id="lien-post">
                            <h2>${post.title}</h2>
                            <p class="description">${post.description}</p>
                            <img src="img/image-post.jpg" alt="premier post" class="image-post">
                        </a>
                        <div class="row interaction-post">
                            <button type="button" id="btnLike" class="btn like">Likes : ${post.likes}</button>
                            <p class="spacer"></p>
                            <button type="button" class="btn commentaire"> Commentaires : </button>
                        </div>
                        <div class="seperate"></div>
                    </div>
                </article>
                `;
            }




            let btnLike = document.getElementById('btnLike');
            btnLike.addEventListener('click', function(e) {
    
                console.log(e);
                console.log(response.posts[0].id);

                // récupère l'id du post



                // Post les données attendu à l'API
                fetch("http://localhost:3000/api/posts/" +  + "/like", {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer ' + tokenAuthentificationPasDuToutSafe
                    }
                }, true)
                .then(response => response.json())
                .then(function (response) {
                    
                    console.log(response);
                })
                .catch(function (error) {
                    console.error(error)
                }); 
    
            })





        }).catch(err => console.log(err));
        
    }
    catch (e) {
        console.log('tu crains');
        console.error(e);
    }
}

affichePosts();
