<template>
<div class="footer">
    <nav class="navbar-nav footer-bg">
        <div class="row list-groupe">
            <div class="col-md-4 col-sm-6">
                <p class="titre text-center">Contact</p>
                <ul class="list">
                    <li><i class="bi bi-geo-alt"></i> Adresse : </li>
                    
                    <li> 36 rue des pommiers</li>
                    <li>59630 Machinville</li>
                    <hr>
                    <li><i class="bi bi-telephone"></i> 03 56 56 58 58</li>
                    <li><i class="bi bi-envelope"></i> agence@domaine.fr</li>
                </ul>
            </div>
            <div class="col-md-4 col-sm-6">
                <p class="titre text-center">Partenariat</p>
                <ul class="list list-liens">
                    <li><a href="/">www.doamine.com</a> </li>
                    <li><a href="/">www.partenaire.fr</a></li>
                    <li><a href="/">www.untruc.fr</a></li>
                    <li><a href="/">www.unadressepluslong.com</a></li>
                    <li><a href="/">www.quelquehcose.fr</a></li>
                </ul>
            </div>
            <div class="col-md-4">
                <p class="titre text-center">Rejoignez nous</p>
                <ul class="list list-icons">
                    <li><a href="/"><i class="bi bi-facebook"></i></a></li>
                    <li><a href="/"><i class="bi bi-twitter"> </i></a></li>
                    <li><a href="/"><i class="bi bi-github">  </i></a></li>
                    <li><a href="/"><i class="bi bi-linkedin"></i></a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="copyright">
        <p class="copyright__text">Copyright 2020-2021 - Tous droits réservés. <a href="/">Mentions légales</a></p>
    </div>
</div>
</template>



<script>
export default {
    
}
</script>



<style scoped lang="scss">

.footer{
    color:rgb(0, 0, 0);
    margin:0;
    padding:0;

    .footer-bg{
        background-color: rgb(206, 206, 206);
    }
    .row{
        margin: 20px 0;
    }
    ul{
        list-style-type: none;
    }
}

.list-groupe{
    .titre{
        font-size:1.2rem;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .list{
        margin-bottom:40px;
    }
    .list-liens a{
        color:black;
    }
    .list-icons{
        font-size:2rem;
        display: flex;
        justify-content: center;

        padding: 0;

        li{
            padding:0 1vw;
        }
        .bi-github{
            color:black;
        }
    }
}


.copyright{
    color:rgb(0, 0, 0);
    background-color: rgb(167, 167, 167);
    
    display:flex;
    justify-content:center;

    &__text{
        margin:0;
        font-size:0.8rem;
    }
}

</style>