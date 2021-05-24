<template>
<div>
    <Header/>
            <main style="height: 100%; margin-top: 8em;">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-3 themed-grid-col"></div>
                    <div class="col-md-6 themed-grid-col">
                        <h1 class="text-center fw-normal display-1">GreenHouse</h1>
                        <img src="../assets/svg/043-hydroponic.svg" class="mt-2 mb-3 center-element" alt="GreenHouse" width="400em">
                        <p class="lead fs-5 fw-normal text-center">Добро пожаловать на сайт дипломного проекта сдудента ДГТУ Ячменева Ярослава Владимировича.</p>
                        <p class="lead fs-5 fw-normal text-center">Для того, чтобы зайти в панель управления</p>
                        <router-link to="/user/auth" class="btn btn-outline-success btn-lg center-element" style="width: fit-content;">Авторизуйтесь</router-link>
                        <p class="lead fs-5 fw-normal text-center mt-1">или зайдите </p>
                        <a href="#" class="lead fs-5 fw-normal text-center btn btn-light center-element" style="width: fit-content;">просто посмотреть</a>

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
components:{
    Header, Footer
}
}
</script>