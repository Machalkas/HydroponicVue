<template>
<div>
    <Header/>
            <main style="height: 100%; margin-top: 8em;">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-3 themed-grid-col"></div>
                    <div class="col-md-6 themed-grid-col">
                        <h1 class="text-center fw-normal display-1">404</h1>
                        <!-- <img src="../assets/svg/043-hydroponic.svg" class="mt-2 mb-3 center-element" alt="GreenHouse" width="400em"> -->
                        <p class="lead fs-5 fw-normal text-center">Страница не найдена</p>

                    </div>
                    <div class="col-md-3 themed-grid-col"></div>
                  </div>
            </div>
        </main>
    </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default{
    metaInfo: {
      title: '404'
    },
components:{
    Header, Footer
}
}
</script>