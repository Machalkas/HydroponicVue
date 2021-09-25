<template>
<div>
    <Header/>
            <main style="height: 100%; margin-top: 8em;">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-3 themed-grid-col"></div>
                    <div class="col-md-6 themed-grid-col">
                        <h2 class="text-center fw-normal mb-5">Выбор устройства</h2>
                        <div class="alert alert-danger" role="alert" v-bind:class="{ternoff:!error}">
                            {{error}}
                        </div>
                        <Loader v-if="loading"/>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            <div v-for="farm in farms">
                                <div class="col">
                                    <div class="device" @click="socket_test(farm.id)">
                                        <p class="ms-3 mb-0 farm_name">{{farm.name}}</p>
                                        <img src="../assets/svg/device_active.svg" alt="" width="160" class="d-inline-block align-text-top img">
                                        <div style="display: flex;position: relative;top: -20%;">
                                            <div class="ms-3 mt-1 indicator" v-bind:class="{online:farm.is_online, offline:!farm.is_online}"></div>
                                            <p style="display: flex; font-size: larger;" class="ms-2">{{farm.is_online ? "Онлайн":"Офлайн"}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-on:click="sendMessage('qwe')">Отправить</div>
                    </div>
                    <div class="col-md-3 themed-grid-col"></div>
                  </div>
            </div>
        </main>
    <!-- <Footer/> -->
    </div>
</template>


<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/loader';
export default{
data(){
    return{
    farms:[],
    loading:true,
    error:"",
    test_socket:null
    }
},
components:{
    Header, Footer, Loader
},
mounted(){
    this.axios.get("/api/get-farms/",{headers: {'Authorization': 'Token '+this.$cookies.get("AuthToken")}}).then(responce=>{
        console.log(responce['data']['farms']);
        this.farms=responce['data']['farms'];
    }).catch(error=>{
        this.error=error;
    }).finally(()=>{this.loading=false})
},
methods:{
    socket_test(id){
        this.test_socket = new WebSocket('ws://127.0.0.1:8000/ws/farm/'+id+'/?Authorization=Token '+this.$cookies.get("AuthToken"))

    this.test_socket.onmessage = function(event) {
      console.log(event);
    }

    this.test_socket.onopen = function(event) {
      console.log(event)
      console.log("Successfully connected to the echo websocket server...")
      console.log(this.test_socket)
    }
    },
    sendMessage: function(message) {
      console.log("Hello")
      console.log(this.test_socket);
      this.test_socket.send('{"action":"is_online"}');
    }
    }
}
</script>

<style scoped>
.device{
    width: 200px;
    height: 200px;
    border: 2px solid #828282;
    border-radius: 10px;
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
}
.device:hover{
    box-shadow:
    1px 1px #53ea93,
    2px 2px #53ea93,
    3px 3px #53ea93,
    4px 4px #53ea93,
    5px 5px #53ea93,
    6px 6px #53ea93,
    7px 7px #53ea93;
    -webkit-transform: translateX(-7px);
    transform: translateX(-7px);
}
.farm_name{
    text-align: left;
    font-size: 1.5em;
}
.indicator{
    width: 17px;
    height: 17px;
    border-radius: 10px;
}
.online{
    border: 2px solid #2CB867;
    background-color: #2CB867;  
}
.offline{
    border: 2px solid #FF0000;
    background-color: #FF0000;  
}
.img{
    position: relative;
    top: -10%;
}
</style>