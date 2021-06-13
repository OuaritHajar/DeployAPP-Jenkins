
let params = new URLSearchParams(document.location.search);
let userId = params.get('userId');
console.log(userId);

const afficheProfilUpdate = async () => {
    try {


        // Edit button
        let btnUpdate = document.getElementById('btnUpdate');
        btnUpdate.addEventListener('click', function (e) {

            // Token 
            var tokenAuthentificationPasDuToutSafe = localStorage.getItem('token');

            // valeur Input
            let inputFirstName = JSON.stringify(document.getElementById('inputFirstName').value);
            let inputLastName = JSON.stringify(document.getElementById('inputLastName').value);

            fetch('http://localhost:3000/api/users/' + userId, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + tokenAuthentificationPasDuToutSafe
                },
                body: JSON.stringify({
                    first_name: inputFirstName,
                    last_name: inputLastName
                })
            })
            .then(response => response.json()).then(function(response) {
                console.log(response);
                
                //window.location.href = "profil.html?userId=" + response.id;

            }).catch(err => console.log(err));


        });




    }
    catch (e) {
        console.error(e);
    }
}








afficheProfilUpdate();



