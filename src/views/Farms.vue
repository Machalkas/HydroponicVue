<template>
<div>
    <Header/>
            <main style="height: 100%; margin-top: 8em;">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-3 themed-grid-col"></div>
                    <div class="col-md-6 themed-grid-col">
                        <h2 class="text-center fw-normal">Выбор устройства</h2>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            <div class="col">
                                <div style="width: 200px;height: 200px;border: 2px solid #828282;border-radius: 10px;">
                                    <p class="ms-3" style="text-align: left;font-size: 1.5em;">Салат</p>
                                    <img src="/img/043-hydroponic.155234b6.svg" alt="" width="100" class="d-inline-block align-text-top">
                                    <div style="width: 17px;height: 17px;border: 2px solid forestgreen;border-radius: 10px;background-color: forestgreen;" class="ms-2 mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 themed-grid-col"></div>
                  </div>
            </div>
        </main>
    <Footer/>
    </div>
</template>


<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default{
data(){
    return{
    farms:[],
    loading:true
    }
},
components:{
    Header, Footer
},
mounted(){
    this.axios.get("/api/get-farms/",{headers: {'Authorization': 'Token '+this.$cookies.get("AuthToken")}}).then(responce=>{
        console.log(responce);
    })
}
}
</script>