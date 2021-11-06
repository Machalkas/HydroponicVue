<template>
    <div>
        <notifications group="auth" />
         <main style="height: 100%; margin-top: 5em;" class="form-signin text-center">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-3 themed-grid-col"></div>
                    <div class="col-md-6 themed-grid-col">
                        <img class="mb-4" src="../assets/svg/043-hydroponic.svg" alt="" width="72">
                            <h1 class="h3 mb-3 fw-normal">Авторизация</h1>
                            <!-- <Loader v-if="loading"/> -->
                            <div class="tab-content" id="pills-tabContent">
                                <b-tabs content-class="mt-3" fill >
                                    <b-tab active>
                                        <template #title>
                                            <b-spinner type="border" small v-if="loading_login"></b-spinner> Вход
                                        </template>
                                        <div class="alert alert-danger" role="alert" v-bind:class="{ternoff:!error_login}">
                                            {{error_login}}
                                        </div>
                                        <form id="log" @submit.prevent="Login">    
                                            <div class="form-floating">
                                            <input type="email" class="form-control" v-model="email_login" placeholder="name@example.com">
                                            <label for="floatingInput">Email адрес</label>
                                            </div>
                                            <div class="form-floating">
                                            <input type="password" class="form-control" v-model="password_login" placeholder="Password">
                                            <label for="floatingPassword">Пароль</label>
                                            </div>
                                            <br>
                                            <input type="submit" class="w-100 btn btn-lg btn-primary" value="Вход" id="login" v-bind:disabled="loading_login">
                                        </form>
                                    </b-tab>
                                    <b-tab>
                                        <template #title>
                                            <b-spinner type="border" small v-if="loading_reg"></b-spinner> Регистрация
                                        </template>
                                        <div class="alert alert-danger" role="alert" v-bind:class="{ternoff:!error_reg}">
                                                {{error_reg}}
                                            </div>
                                            <form id="reg" @submit.prevent="Registration">    
                                                <div class="form-floating">
                                                <input type="email" class="form-control" v-model="email_reg" placeholder="name@example.com">
                                                <label for="floatingInput">Email адрес</label>
                                                </div>
                                                <div class="form-floating">
                                                <input type="password" class="form-control" v-model="password_reg" placeholder="Password">
                                                <label for="floatingPassword">Пароль</label>
                                                </div>
                                                <br>
                                                <input type="submit" class="w-100 btn btn-lg btn-primary" value="Регистрация"  id="registration"  v-bind:disabled="loading_reg">
                                            </form>
                                    </b-tab>
                                </b-tabs>
                                <p class="mt-5 mb-3 text-muted">2021</p>
                            </div>
                    </div>
                    <div class="col-md-3 themed-grid-col"></div>
                  </div>
            </div>
        </main>
    </div>
</template>

<script>
// import Loader from '@/components/loader';
export default {
    metaInfo: {
      title: 'Авторизация'
    },
    data(){
        return{
            email_login:'',
            password_login:'',
            email_reg:'',
            password_reg:'',
            error_login:"",
            error_reg:"",
            loading_login:false,
            loading_reg:false
        }
    },
    components:{
        // Loader
    },
    methods:{
        Login(){ 
            if(this.email_login.trim() && this.password_login.trim()){
                this.loading_login=true;
                this.error_login="";
                this.axios.post("/auth/token/login/",{email:this.email_login, password:this.password_login}).then(
                    response=>{
                        this.$cookies.set("AuthToken", response["data"]["auth_token"]);
                        this.$router.push({ name: 'farm' });
                        }
                    ).catch(error=>{
                    this.error_login=error;
                    }).finally(()=>this.loading_login=false);
            }
            else{
                console.log("error")
            }
        },
        Registration(){
            if(this.email_reg.trim() && this.password_reg.trim()){
                this.loading_reg=true;
                this.error_reg="";
                this.axios.post("/auth/users/",{email:this.email_reg, password:this.password_reg}).then(
                    response=>{
                        console.log(response);
                        if(response['data']['email']==this.email_reg){
                            this.email_login=this.email_reg;
                            this.password_login=this.password_reg;
                            this.Login();
                        }else{
                            this.error_reg="Ошибка авторизации";
                        }
                    }
                    ).catch(error=>{
                    this.error_reg=error;
                    }).finally(()=>this.loading_reg=false);
            }
            else{
                console.log("error")
            }
        }
    }
}
</script>

<style scoped>
    .form-signin {
        width: 100%;
        max-width: 700px;
        padding: 15px;
        margin: auto;
    }
    .form-signin input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
    .form-signin input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
</style>