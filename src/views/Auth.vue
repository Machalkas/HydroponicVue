<template>
    <div>
        <notifications group="auth" />
         <main style="height: 100%; margin-top: 10em;" class="form-signin text-center">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-3 themed-grid-col"></div>
                    <div class="col-md-6 themed-grid-col">
                        <img class="mb-4" src="../assets/svg/043-hydroponic.svg" alt="" width="72">
                            <h1 class="h3 mb-3 fw-normal">Авторизация</h1>

                            <ul class="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
                                <li class="nav-item" role="presentation">
                                  <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Вход</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                  <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Регистрация</button>
                                </li>
                              </ul>

                            <div class="tab-content" id="pills-tabContent">
                                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div class="alert alert-danger" role="alert" v-bind:class="{ternoff:!loginError}">
                                        {{error}}
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
                                        <input type="submit" class="w-100 btn btn-lg btn-primary" value="Вход" id="login">
                                      </form>
                                </div>
                                <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <div class="alert alert-danger" role="alert" v-bind:class="{ternoff:!regError}">
                                        Не удалось войти с предоставленными учетными данными
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
                                        <input type="submit" class="w-100 btn btn-lg btn-primary" value="Регистрация"  id="registration">
                                      </form>
                                </div>
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
import axios from 'axios';
export default {
    props:{
        error:""
    },
    data(){
        return{
            email_login:'',
            password_login:'',
            email_reg:'',
            password_reg:'',
            loginError:false,
            regError:false
        }
    },
    methods:{
        Login(){ 
            console.log("start request")
            if(this.email_login.trim() && this.password_login.trim()){
                this.loginError=false;
                axios.post("http://127.0.0.1:8000/auth/token/login",{email:this.email_login, password:this.password_login}).then(
                    response=>{
                        // this.resp=response["data"]["auth_token"];
                        this.$cookies.config('30d');
                        this.$cookies.set("AuthToken", response["data"]["auth_token"]);

                        }
                    ).catch(error=>{
                    this.loginError=true;
                    this.error=error;
                    });
            }
            else{
                console.log("error")
            }
        },
        Registration(){

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
   .ternoff{
       display:none;
   }
</style>