let params = new URLSearchParams(document.location.search)
let postId = params.get('postId')

const posts = async () => {
    try {

        // récupère le token 
        var tokenAuthentificationPasDuToutSafe = localStorage.getItem('token');

        // On récupère les données du serveur
        fetch('http://localhost:3000/api/posts/' + postId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokenAuthentificationPasDuToutSafe
            }
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(`erreur HTTP! statut: ${response.status}`);
                }
                return response.json();
            }).then(function (response) {

                console.log(response);
                const articles = document.getElementById('post');

                articles.innerHTML += `
                <div class="post">
                <p class="author">posté par ${response.post.users}</p>
                <h2>${response.post.title}</h2>
                <p class="description">${response.post.description}</p>
                <a href="post.html"><img src="img/image-post.jpg" alt="premier post poto"
                        class="image-post"></a>
                <div class="row interaction-post">
                    <p><a href="*" class="like">Likes</a>: ${response.post.like} </p>
                    <p class="spacer">-</p>
                    <p><a href="*" class="commentaire"> Commentaire </a>: ${response.comment}</p>
                </div>
                <p>Cree le : ${response.post.createdAt} </p>
                <p>Modifier le : ${response.post.updatedAt} </p>
                <div class="seperate"></div>
                </div>
                `






                // boucle qui affiche les commentaires
                for (comment of response.comments) {
                    articles.innerHTML += `
                    <div class="media">
                    <img class="align-self-start mr-3" src="img/ico03.png" alt="Generic placeholder image">
                        <div class="media-body">
                            <a href="profil.html" class="author-commentaire">${comment.userId}</a>
                            <p>${comment.description}</p>
                        </div>
                    </div>
                        `;
                }







            }).catch(err => console.log(err));
    }
    catch (e) {
        console.log('tu crains');
        console.error(e);
    }
}

posts();

