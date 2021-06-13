
let params = new URLSearchParams(document.location.search);
let userId = params.get('userId');
console.log(userId);

const afficheProfil = async () => {
    try {

        // récupère le token 
        var tokenAuthentificationPasDuToutSafe = localStorage.getItem('token');

        // On récupère les données du serveur
        fetch('http://localhost:3000/api/users/' + userId, {
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

            // affiche le post ciblé
            const profil = document.getElementById('profil-utilisateur');
            profil.innerHTML += `
                <div class="nom-description">
                    <h2>${response.first_name} ${response.last_name}</h2>
                    <p class="description">Lorem upsum lorem tas id este labor ominisLorem upsum lorem tas id este labor ominisLorem upsum lorem tas id este labor ominisLorem upsrem tas id este labor ominiLum lorem tid este labor ominisLorem upsum lorem taseste labor ominisLorem  lorem tas id estelabor omorem upsum lorem tas i labor ominis et sanctis
                    </p>
                    <div class="user-info">
                        <p class="email">Email : ${response.email}</p>
                        <p class="cree">Créé le ${response.createdAt}</p>
                    </div>
                </div> `




            // évenement
            let btnEdit = document.getElementById('btnEdit');
            btnEdit.addEventListener('click', function(e) {

                
                window.location.href = "update-profil.html?userId=" + response.id;


            });





        }).catch(err => console.log(err));





    }
    catch (e) {
        console.error(e);
    }
}




afficheProfil();



