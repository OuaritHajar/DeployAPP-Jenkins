
// Structure du post
class Post {
    constructor (id, userId, title, img_url, description, createdOn, updatedOn ) {
        this.id = id;
        this.userId = userId;
    }
}





const affichePost = async function() {
    try{
        let response = await fetch('http://localhost:3000/api/signup')
        if (response.ok) {
            let data = await response.json()
            console.log(data)
            const articles = document.getElementById('articles')

        
        }

        else{
            console.error('Retour du serveur : ', response.status)
        } 
    } catch (e) {
        console.error(e)
    }
    console.log(localStorage)
}

affichePost()

