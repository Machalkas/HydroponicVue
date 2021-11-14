<template>
    <div>
        <notifications group="foo" />
       <Header/>
            <main style="height: 100%; margin-top: 8em;">
            <Loader v-if="loading"/>
            <div class="container mt-3" v-if="!loading">
                <div class="row mb-3">
                    <div class="col-md-2 themed-grid-col"></div>
                    <div class="col-md-8 themed-grid-col">
                        <div style="display: flex; justify-content: center;">
                            <h2 class="text-center fw-normal mb-5">{{name}}</h2>
                            <div class="ms-3 mt-1 indicator" v-bind:class="{online:is_online, offline:!is_online}"></div>
                        </div>
                        <!-- <Loader v-if="loading"/> -->
                        <div class="container">
                            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                <div class="col">
                                    <div class="s_indicator">
                                        <p class="s_indicator_name">Влажность</p>
                                        <p class="s_indicator_val">{{hum}}%</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="s_indicator">
                                        <p class="s_indicator_name">Температура</p>
                                        <p class="s_indicator_val">{{temp}}°C</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="s_indicator">
                                        <p class="s_indicator_name">Температура раствора</p>
                                        <p class="s_indicator_val">{{w_temp}}°C</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="s_indicator">
                                        <p class="s_indicator_name">CO2</p>
                                        <p class="s_indicator_val">{{co2}}ppm</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="s_indicator">
                                        <p class="s_indicator_name">PH</p>
                                        <p class="s_indicator_val">{{ph}}</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="s_indicator">
                                        <p class="s_indicator_name">TDS</p>
                                        <p class="s_indicator_val">{{tds}}ppm</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-3">
                            <Loader v-if="loading_charts"/>
                            <div id="charts">
                                <div v-if="!loading_charts">
                                    <p class="text-center fw-normal mt-5 fs-4">Статистика</p>
                                    <apexchart width="100%" type="line" :options="chartOptions" :series="series"></apexchart>
                                </div>
                                <div v-if="!loading_charts">
                                    <apexchart height="200" type="line" :options="chartOptionsLine" :series="series"></apexchart>
                                </div>
                            </div>
                            <div id="calendar" class="mt-3" v-if="!loading_charts">
                                 <p class="text-center fw-normal mt-5 fs-4">Расписание</p>
                                <calendar
                                    :columns="$screens({ default: 1, lg: 3 })"
                                    :rows="$screens({ default: 1, lg: 1 })"
                                    :is-expanded="$screens({ default: true, lg: false })"
                                    :attributes="calendar_attributes"
                                    @dayclick="onDayClick"
                                />
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
            loading_charts:true,
            now_date_interval:null,
            socket:null,
            name:"...",
            is_online:false,
            timerID:0,
            min_date:null,
            max_date:null,

            hum:"-",
            temp:"-",
            w_temp:"-",
            co2:"-",
            ph:"-",
            tds:"-",
            
            timetable:null,

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
                        enabled: true,
                        easing: "linear",
                         animateGradually: {
                            enabled: false,
                        },
                    },
                    
                },
                // title:{
                //     text:"Статистика",
                //     align:"center"
                //     },
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
                            range:5,
                            min: this.min_date,
                            max: this.max_date,
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
            calendar_attributes:[{
                key: 'today',
                dates: new Date(),
                highlight: {
                    color: 'blue',
                    fillMode: 'outline',
                },
            },
            {
                key: 'task',
                highlight: 'green',
                dates: null,
            },
            {
                key: 'past_task',
                highlight:{
                    color: 'green',
                    fillMode: 'light',
                },
                dates: null,

            }],
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
        this.socketStart()
        // setInterval(function(){console.log(this.socket);if(this.socket==null || this.socket.readyState==3){console.log(true);this.socket = new WebSocket('ws://'+vm.$hostname+'/ws/farm/'+vm.$route.params.id+'/?Authorization=Token '+vm.$cookies.get("AuthToken"))}},1000)
        
    },
    beforeDestroy(){
        clearInterval(this.now_date_interval)
        this.socket.close(1000)
    },
    methods:{
        socketStart(){
            let vm=this
            this.socket = new WebSocket('ws://'+this.$hostname+'/ws/farm/'+this.$route.params.id+'/?Authorization=Token '+this.$cookies.get("AuthToken"))
            this.socket.onopen = function(event) {
                if (vm.timerID){
                    clearInterval(vm.timerID)
                    vm.timerID=0
                }
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
                // setTimeout(()=>console.log("test timeout"),1000)
                // setTimeout(()=>vm.socket = new WebSocket('ws://'+vm.$hostname+'/ws/farm/'+vm.$route.params.id+'/?Authorization=Token '+vm.$cookies.get("AuthToken")),1000)
            }

            this.socket.onclose = function(event){
                if (event.code!=1000){
                    vm.loading=true
                    vm.loading_charts=true
                    if(!vm.timerID){
                        vm.timerID=setInterval(function(){vm.socketStart()}, 5000)
                    }
                }
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
                         let datetime
                        for(let i in data){
                            let field=data[i]["fields"]
                            datetime=new Date(field["record_date"]).getTime()
                            vm.series[0].data.push({x:datetime,y:(field["ph"]!=null)?field["ph"].toFixed(2):null})
                            vm.series[1].data.push({x:datetime,y:(field["tds"]!=null)?field["tds"].toFixed(2):null})
                            vm.series[2].data.push({x:datetime,y:(field["water_temp"]!=null)?field["water_temp"].toFixed(2):null})
                            vm.series[3].data.push({x:datetime,y:(field["air_temp"]!=null)?field["air_temp"].toFixed(2):null})
                            vm.series[4].data.push({x:datetime,y:(field["humidity"]!=null)?field["humidity"].toFixed(2):null})
                            vm.series[5].data.push({x:datetime,y:(field["co2"]!=null)?field["co2"].toFixed(2):null})
                        }
                        vm.loading_charts=false;
                        vm.min_date=datetime
                        datetime=new Date(datetime)
                        datetime.setDate(datetime.getDate()-7)
                        vm.max_date=datetime.getTime()
                        
                        // vm.series[0]={data:new_data}

                    }
                    else if(data["timetable"]!=undefined){
                        data=data["timetable"]
                        vm.timetable={dates:[],past_dates:[],params:[]}
                        for(let i in data){
                            let field=data[i]["fields"]
                            let date=new Date(field["date"]).toDateString()
                            // if(new Date()>date){
                            //     vm.timetable.past_dates.push(date)
                            // }else{
                                vm.timetable.dates.push(date)
                            // }
                            let params={}
                            for(let val in field){
                                if(field[val]!=null && val!="date"){
                                    // console.log(val+" "+field[val])
                                    params[val]=field[val]
                                }
                            }
                            vm.timetable.params.push(params)
                        }
                        vm.calendar_attributes[1].dates=vm.timetable.dates
                        vm.updateNowDate()
                        // vm.calendar_attributes[2].dates=vm.timetable.past_dates
                    }
                }
                
            }
        },
        
        sendMessage(action,options='{}') {
            console.log("sending: "+'{"action":"'+action+'","options":'+options+'}')
            this.socket.send('{"action":"'+action+'","options":'+options+'}');
        },

        onDayClick(day){
            let index=-1
            for (let i in this.timetable.dates){
                if (this.timetable.dates[i]==new Date(day.date).toDateString()){
                    index=i
                }
            }
            if(index==-1){
                console.log("None")
            }
            else{
                console.log(this.timetable.params[index])
                alert(index)
            }
        },
        updateNowDate(){
            this.now_date_interval=setInterval(()=>{
                this.calendar_attributes[0].dates=new Date()
            },1000)
        }
    },
}
</script>

<style scoped>
    .s_indicator{
        border: 2px solid #828282;
        border-radius: 10px;
    }
    .s_indicator_name{
        font-size: 1.4em;
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
