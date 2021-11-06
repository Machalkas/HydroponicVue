<template>
    <div>
        <notifications group="foo" />
       <Header/>
            <main style="height: 100%; margin-top: 8em;">
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col-md-2 themed-grid-col"></div>
                    <div class="col-md-8 themed-grid-col">
                        <div style="display: flex; justify-content: center;">
                            <h2 class="text-center fw-normal mb-5">{{name}}</h2>
                            <div class="ms-3 mt-1 indicator" v-bind:class="{online:is_online, offline:!is_online}"></div>
                        </div>
                        <Loader v-if="loading"/>
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            <div class="col s_indicator">
                                <p class="s_indicator_name">Влажность</p>
                                <p class="s_indicator_val">{{hum}}%</p>
                            </div>
                            <div class="col s_indicator">
                                <p class="s_indicator_name">Температура</p>
                                <p class="s_indicator_val">{{temp}}°C</p>
                            </div>
                            <div class="col s_indicator">
                                <p class="s_indicator_name">Температура раствора</p>
                                <p class="s_indicator_val">{{w_temp}}°C</p>
                            </div>
                            <div class="col s_indicator">
                                <p class="s_indicator_name">CO2</p>
                                <p class="s_indicator_val">{{co2}}ppm</p>
                            </div>
                            <div class="col s_indicator">
                                <p class="s_indicator_name">PH</p>
                                <p class="s_indicator_val">{{ph}}ph</p>
                            </div>
                            <div class="col s_indicator">
                                <p class="s_indicator_name">TDS</p>
                                <p class="s_indicator_val">{{tds}}ppm</p>
                            </div>
                        </div>

                        <div>
                            <div>
                                <apexchart width="100%" type="line" :options="chartOptions" :series="series"></apexchart>
                            </div>
                            <div>
                                <apexchart height="200" type="line" :options="chartOptionsLine" :series="series"></apexchart>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 themed-grid-col"></div>
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
            name:"",
            is_online:false,

            hum:"-",
            temp:"-",
            w_temp:"-",
            co2:"-",
            ph:"-",
            tds:"-",

            series: [{
                name: 'PH',
                data: []
            },
            {
                name:'TDS',
                data:[]
            },
            {
                name:'температура раствора',
                data:[]
            },
            {
                name:'температура воздуха',
                data:[]
            },
            {
                name:'влажность',
                data:[]
            },
            {
                name:'CO2',
                data:[]
            }],

            chartOptions: {
                chart: {
                    id: "main_chart",
                    type: "line",
                    locales: [require("../assets/ru_charts.json")],
                    defaultLocale: 'ru',
                    toolbar: {
                        autoSelected: 'pan',
                        show: false
                    },
                    animations:{
                        enabled: false,
                    },
                    
                },
                title:{
                    text:"Статистика",
                    align:"center"
                    },
                dataLabels:{
                        enabled: false
                    },
                    
                xaxis: {
                    type: "datetime",
                },
                
                tooltip:{
                    y:{
                        formatter:function(val,i){
                            if(val!=null){
                                if(i.seriesIndex==1 || i.seriesIndex==5){//co2 и tds
                                    return val+"ppm";
                                }
                                else if(i.seriesIndex==2 || i.seriesIndex==3){//температура
                                    return val+"°C";
                                }
                                else if(i.seriesIndex==4){//влажность
                                    return val+"%";
                                }
                                else{
                                    return val;
                                }
                            }
                        }
                    }
                },
            },
            chartOptionsLine:{
                chart:{
                    type:"line",
                    locales: [require("../assets/ru_charts.json")],
                    defaultLocale: 'ru',
                    brush:{
                        target:"main_chart",
                        enabled: true
                    },
                    toolbar:{
                        enabled:false
                    },
                    selection:{
                        enabled: true,
                        xaxis:{
                            range:5
                            // min: function(){let d=new Date();d.setDate(d.getDate()-7);return d.getTime()},
                            // max: new Date().getTime(),
                        }
                    },
                    xaxis:{
                        type: "datetime",
                        tooltip:{
                            enabled:false
                        },
                        labels:{
                            show:false
                        }
                        
                    },
                    
                }
            },
        }
    },
    metaInfo(){
        return{
        title: this.name
        }
    },
    components:{
        Header,Footer,Loader
    },
    mounted(){
        setInterval(function(){this.socket.readstate==0},1000)
        let vm=this
         this.socket = new WebSocket('ws://'+this.$hostname+'/ws/farm/'+this.$route.params.id+'/?Authorization=Token '+this.$cookies.get("AuthToken"))
        this.socket.onopen = function(event) {
            vm.sendMessage('farm_name')
            vm.sendMessage('get_statistic')
            vm.sendMessage('get_timetable')
            vm.loading=false
        }

        this.socket.onerror = function(error){
            vm.$notify({
                group: 'foo',
                type:'error',
                title: 'Ошибка',
                text: 'Не удалось подключиться'
            })
            setTimeout(()=>vm.socket = new WebSocket('ws://'+vm.$hostname+'/ws/farm/'+vm.$route.params.id+'/?Authorization=Token '+vm.$cookies.get("AuthToken")),1000)
        }

        this.socket.onmessage = function(event) {
            let data=JSON.parse(event['data'])
            console.log(data)
            if (data['error']!=undefined){
                vm.$notify({
                    group: 'foo',
                    type:'error',
                    title: 'Ошибка',
                    text: data['error']
            })
            }else{
                if(data['farm_name']!=undefined){
                    vm.name=data['farm_name']
                }
                else if(data['is_online']!=undefined){
                    vm.is_online=data['is_online']
                    if (!data['is_online']){
                        vm.temp='-';
                        vm.co2='-';
                        vm.hum='-';
                        vm.ph='-';
                        vm.tds='-';
                        vm.w_temp='-';
                    }
                }
                else if(data['sensors_data']!=undefined){
                    let d=data['sensors_data'];
                    for (let i in d){
                        if(typeof(d[i])=== 'number'){
                            d[i]=d[i].toFixed(1)
                        }
                    }
                    vm.temp=d["air_temp"];
                    vm.co2=d["co2"];
                    vm.hum=d["humidity"];
                    vm.ph=d["ph"];
                    vm.tds=d["tds"];
                    vm.w_temp=d["water_temp"];
                }
                else if(data["statistic"]!=undefined){
                    data=data["statistic"]
                    // let new_data=vm.series[0].data
                    for(let i in data){
                        let field=data[i]["fields"]
                        let datetime=new Date(field["record_date"]).getTime()
                        vm.series[0].data.push({x:datetime,y:(field["ph"]!=null)?field["ph"].toFixed(2):null})
                        vm.series[1].data.push({x:datetime,y:(field["tds"]!=null)?field["tds"].toFixed(2):null})
                        vm.series[2].data.push({x:datetime,y:(field["water_temp"]!=null)?field["water_temp"].toFixed(2):null})
                        vm.series[3].data.push({x:datetime,y:(field["air_temp"]!=null)?field["air_temp"].toFixed(2):null})
                        vm.series[4].data.push({x:datetime,y:(field["humidity"]!=null)?field["humidity"].toFixed(2):null})
                        vm.series[5].data.push({x:datetime,y:(field["co2"]!=null)?field["co2"].toFixed(2):null})
                    }
                    // vm.series[0]={data:new_data}

                }
                // else if(data["timetable"]!=undefined){
                //     data=data["timetable"]
                //     for(let i in data){
                //         let field=data[i]["fields"]
                //         let date=new Date(field["date"])
                //         vm.timeline[0].data.push({x:'параметры',y:[date.getTime(),date.getTime()+1]})
                //         for(let val in field){
                //             if(field[val]!=null && val!="date"){
                //                 // console.log(val+" "+field[val])
                //                 // vm.timeline[0].data.push({x:val+" "+field[val],y:[date.getTime(),date.getTime()+1]})
                //             }
                //         }
                //     }
                // }
            }
            
        }
    },
    methods:{
        // socketConnect(){
        //     this.socket.close(1000, "работа закончена")
        //     this.socket = new WebSocket('ws://'+this.$hostname+'/ws/farm/'+this.$route.params.id+'/?Authorization=Token '+this.$cookies.get("AuthToken"))
        // },
        sendMessage(action,options='{}') {
            console.log("sending: "+'{"action":"'+action+'","options":'+options+'}')
            this.socket.send('{"action":"'+action+'","options":'+options+'}');
        },
    },
}
</script>

<style scoped>
    .s_indicator{
        border: 1px solid #828282;
    }
    .s_indicator_name{
        font-size: 1.5em;
    }
    .s_indicator_val{
        font-size: 1.2em;
    }

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
        display: none;
        /* border: 2px solid #FF0000;
        background-color: #FF0000;   */
    }
</style>
