
let params = new URLSearchParams(document.location.search);
let postId = params.get('postId');
console.log(postId);

const affichePosts = async () => {
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
            // affiche le post ciblé
            const articles = document.getElementById('post');
            console.log(response);
            articles.innerHTML += `
            <div class="post">
            <p class="author">posté par <a href="profil.html?userId=${response.userPost.id}"> ${response.userPost.first_name} ${response.userPost.last_name}</a></p>
            <h2>${response.post.title}</h2>
            <p class="description">${response.post.description}</p>
            <a href="post.html"><img src="img/image-post.jpg" alt="premier post poto"
                    class="image-post"></a>
            <div class="row interaction-post">
                <p><a href="*" class="like">Likes</a>: ${response.post.likes} </p>
                <p class="spacer">-</p>
                <p><a href="*" class="commentaire"> Commentaire </a>: ${response.comments.length}</p>
            </div>
            <p>Cree le : ${response.post.createdAt} </p>
            <p>Modifier le : ${response.post.updatedAt} </p>
            <div class="seperate"></div>
            </div>
            `
        }).catch(err => console.log(err));








        // affiche tout les commentaires
        fetch('http://localhost:3000/api/posts/' + postId + '/comments', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + tokenAuthentificationPasDuToutSafe
            }
        })
        .then(function (responseComments) {
            if (!responseComments.ok) {
                throw new Error(`erreur HTTP! statut: ${responseComments.status}`);
            }
            return responseComments.json();

        }).then(function (responseComments) {
            const comments = document.getElementById('comments');
            console.log(responseComments);

            // boucle qui affiche la liste des produits
            for (comment of responseComments) {
                comments.innerHTML += `
                    <article>
                        <div class="media">
                            <img class="align-self-start mr-3" src="img/ico01.png" alt="Generic placeholder image">
                            <div class="media-body">
                                <a href="profil.html" class="author-commentaire">${comment.UserId}</a>
                                <p>${comment.description}</p>
                            </div>
                        </div>
                    </article>
                    `;
            }
        }).catch(err => console.log(err));









        // écoute le bouton post commentaire
        const btn = document.getElementById('btnSubmit');
        btn.addEventListener('click', function (e) {
            // post nouveau commentaire
            let inputDescription = document.getElementById('inputDescription').value;

            fetch('http://localhost:3000/api/posts/' + postId + '/comment', {
                method: "POST",
                body: JSON.stringify({
                    description: inputDescription
                }),
                headers: {
                    'Authorization': 'Bearer ' + tokenAuthentificationPasDuToutSafe
                }
            }
            .then(responseSubmitComment => responseSubmitComment.json())
            .then(function (responseSubmitComment) {

                console.log(responseSubmitComment);
                
            }).catch(err => console.log(err))
            )
        })
    





    }
    catch (e) {
        console.error(e);
    }
}








affichePosts();



