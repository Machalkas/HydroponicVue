<template>
    <div>
       <Header/>
            <main style="height: 100%; margin-top: 8em;">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-3 themed-grid-col"></div>
                    <div class="col-md-6 themed-grid-col">
                        <div style="display: flex; justify-content: center;">
                            <h2 class="text-center fw-normal mb-5">{{name}}</h2>
                            <div class="ms-3 mt-1 indicator" v-bind:class="{online:is_online, offline:!is_online}"></div>
                        </div>
                        <div class="alert alert-danger" role="alert" v-bind:class="{ternoff:!error}">
                            {{error}}
                        </div>
                        <Loader v-if="loading"/>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

                        </div>
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
            loading:true,
            socket:null,
            error:"",
            name:"...",
            is_online:false
        }
    },
    components:{
        Header,Footer,Loader
    },
    mounted(){
        let vm=this
        try{
            this.socket = new WebSocket('ws://127.0.0.1:8000/ws/farm/'+this.$route.params.id+'/?Authorization=Token '+this.$cookies.get("AuthToken"))
        }catch(error){
            this.error=error;
        }finally{}

        this.socket.onopen = function(event) {
            vm.sendMessage('farm_name')
            vm.loading=false
        }
// в onmessage не видно переменные и методы, потому что это другой this 
        this.socket.onmessage = function(event) {
            let data=JSON.parse(event['data'])
            console.log(data)
            if (data['error']!=undefined){
                vm.error=data['error']
            }else{
                vm.error=""
                if(data['farm_name']!=undefined){
                    vm.name=data['farm_name']
                }
                else if(data['is_online']!=undefined){
                    vm.is_online=data['is_online']
                }
            }
            
        }
    },
    methods:{
        sendMessage(action,options='{}') {
            console.log("sending: "+'{"action":"'+action+'","options":'+options+'}')
            this.socket.send('{"action":"'+action+'","options":'+options+'}');
        },
    },
}
</script>

<style scoped>
    .indicator{
        width: 20px;
        height: 20px;
        border-radius: 26px;
    }
    .online{
        border: 2px solid #2CB867;
        background-color: #2CB867;  
    }
    .offline{
        border: 2px solid #FF0000;
        background-color: #FF0000;  
    }
</style>
