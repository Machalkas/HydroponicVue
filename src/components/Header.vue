<template>
    <div class="fixed-top shadow-sm center-element bg-light" style="height: 6em; width: 100%;">
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4">
            <router-link to="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
            <img src="../assets/svg/043-hydroponic.svg" alt="" width="50" class="d-inline-block align-text-top">
            <span class="fs-4">GreenHouse</span>
            </router-link>
<!--     
            <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" class="nav-link px-2 link-secondary">Home</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">Features</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">Pricing</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">FAQs</a></li>
            <li><a href="#" class="nav-link px-2 link-dark">About</a></li>
            </ul> -->
    
            <div class="col-md-3 text-end">
            <a href="#" class="btn btn-outline-danger" v-if="this.$cookies.get('AuthToken')!=null" v-on:click="logout">Выйти</a>
            <router-link to="/user/auth" class="btn btn-success" v-if="this.$cookies.get('AuthToken')==null">Авторизация</router-link>
            </div>
        </header>
    </div>
    </div>
</template>

<script>
export default {
    name:"Header",
    methods:{
        logout:function(){
            this.$cookies.remove("AuthToken");
            this.$router.push({ name: 'auth' });
        } 
    }
}
</script>