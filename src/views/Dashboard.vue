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
                                    <div class="grey_border">
                                        <p class="s_indicator_name">Влажность</p>
                                        <p class="s_indicator_val">{{hum}}%</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="grey_border">
                                        <p class="s_indicator_name">Температура</p>
                                        <p class="s_indicator_val">{{temp}}°C</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="grey_border">
                                        <p class="s_indicator_name">Температура раствора</p>
                                        <p class="s_indicator_val">{{w_temp}}°C</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="grey_border">
                                        <p class="s_indicator_name">CO2</p>
                                        <p class="s_indicator_val">{{co2}}ppm</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="grey_border">
                                        <p class="s_indicator_name">PH</p>
                                        <p class="s_indicator_val">{{ph}}</p>
                                    </div>
                                </div>
                                <div class="col">
                                    <div class="grey_border">
                                        <p class="s_indicator_name">TDS</p>
                                        <p class="s_indicator_val">{{tds}}ppm</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-3">
                            <Loader v-if="loading_charts"/>
                            <div id="charts" v-if="!loading_charts">
                                <div>
                                    <p class="text-center fw-normal mt-5 fs-4">Статистика</p>
                                    <apexchart width="100%" type="line" :options="chartOptions" :series="series"></apexchart>
                                </div>
                                <div>
                                    <apexchart height="200" type="line" :options="chartOptionsLine" :series="series"></apexchart>
                                </div>
                            </div>
                            <Loader v-if="loading_timetable"/>
                            <div id="calendar" class="mt-3" v-if="!loading_timetable">
                                 <p class="text-center fw-normal mt-5 fs-4">Расписание</p>
                                <calendar
                                    :columns="$screens({ default: 1, lg: 3 })"
                                    :rows="$screens({ default: 1, lg: 1 })"
                                    :is-expanded="$screens({ default: true, lg: false })"
                                    :attributes="calendar_attributes"
                                    @dayclick="onDayClick"
                                />


                                <div class="grey_border mt-4" style="text-align: initial;">
                                    <div class="modal-header border-bottom-0">
                                        <p class="m-2 h4 modal-title">{{selected_timetable.date}}</p>
                                        <div class="del_button">
                                             <img src="../assets/svg/bin.svg" alt="" height="20" class="mb-2 bin" v-on:click="deleteParameters(selected_timetable.date)" v-bind:class="{del_button_activate:selected_timetable.is_deleted, del_button:!selected_timetable.is_deleted}">
                                             <!-- <p>{{selected_timetable.is_deleted}}</p> -->
                                        </div>
                                    </div>
                                    <div class="row m-3 ml-2" v-bind:class="{disabled_input:selected_timetable.is_deleted}">
                                        <p class="h5">Свет</p>
                                        <div class="col-sm-6">
                                            <label for="timeOn" class="form-label">Время включения</label>
                                            <input type="time" class="form-control" id="timeOn" placeholder="" v-on="inputListeners" v-model="selected_timetable.light_on_time" required="">
                                            <div class="invalid-feedback">
                                            Valid first name is required.
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="timeOff" class="form-label">Время выключения</label>
                                            <input type="time" class="form-control" id="timeOff" placeholder="" v-on="inputListeners" v-model="selected_timetable.light_off_time" required="">
                                            <div class="invalid-feedback">
                                            Valid first name is required.
                                            </div>
                                        </div>
                                    </div> 
                                    <div class="row m-3 ml-2" v-bind:class="{disabled_input:selected_timetable.is_deleted}">
                                        <p class="h5">CO2</p>
                                        <div class="col-12">
                                            <input type="number" min="0" max="5000" step="1" class="form-control" id="co2" placeholder="" v-on="inputListeners" v-model="selected_timetable.co2"  required="">
                                            <small class="text-muted">ppm</small>
                                            <div class="invalid-feedback">
                                            Valid first name is required.
                                            </div>
                                        </div>
                                    </div> 
                                    <div class="row m-3 ml-2" v-bind:class="{disabled_input:selected_timetable.is_deleted}">
                                        <p class="h5">Растворы</p>
                                        <div class="col-sm-4">
                                            <label for="solution1" class="form-label">Раствор 1</label>
                                            <input type="number" min="0" class="form-control" id="solution1" placeholder="" v-on="inputListeners" v-model="selected_timetable.solution1" required="">
                                            <small class="text-muted">ml</small>
                                            <div class="invalid-feedback">
                                            Valid first name is required.
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="solution2" class="form-label">Раствор 2</label>
                                            <input type="number" min="0" class="form-control" id="solution2" placeholder="" v-on="inputListeners" v-model="selected_timetable.solution2" required="">
                                            <small class="text-muted">ml</small>
                                            <div class="invalid-feedback">
                                            Valid first name is required.
                                            </div>
                                        </div>
                                        <div class="col-sm-4">
                                            <label for="solution3" class="form-label">Раствор 3</label>
                                            <input type="number" min="0" class="form-control" id="solution3" placeholder="" v-on="inputListeners" v-model="selected_timetable.solution3" required="">
                                            <small class="text-muted">ml</small>
                                            <div class="invalid-feedback">
                                            Valid first name is required.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="m-4" v-bind:class="{disabled_input:!changed_timetable[selected_timetable.date]}">
                                        <button type="button" class="btn btn-danger" v-on:click="resetParameters(selected_timetable.date)">Сбросить</button>
                                    </div>
                                </div>
                                <div class="m-2" v-bind:class="{disabled_input:!Object.keys(changed_timetable).length}">
                                    <button type="button" class="btn btn-success m-1" v-on:click="saveParameters() ">Сохранить все</button>
                                    <button type="button" class="btn btn-danger m-1" v-on:click="resetParameters()">Сбросить все</button>
                                </div>
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
            loading_timetable:true,
            now_date_interval:null,
            socket:null,
            name:"...",
            is_online:false,
            timerID:0,
            // min_date:null,
            // max_date:null,

            hum:"-",
            temp:"-",
            w_temp:"-",
            co2:"-",
            ph:"-",
            tds:"-",
            
            timetable:null,
            changed_timetable:{},
            selected_timetable:{
                date:null,
                light_on_time:null,
                light_off_time:null,
                co2:null,
                solution1:null,
                solution2:null,
                solution3:null,
                is_deleted:false,
            },

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
                key: 'changed_task',
                highlight: 'yellow',
                dates: null,

            },
            {
                key: 'deleted_task',
                highlight: 'red',
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
        clearInterval(this.timerID)
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
                    vm.loading_timetable=true
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
                        let datetime
                        data=data["statistic"]
                        console.log("data=",data)
                        if (!Array.isArray(data)){
                            data=[{fields:data}]
                        }
                        for(let i in data){
                            console.log('i=',i)
                            let field=data[i]["fields"]
                            datetime=new Date(field["record_date"]).getTime()
                            vm.series[0].data.push({x:datetime,y:(field["ph"]!=null)?field["ph"].toFixed(2):null})
                            vm.series[1].data.push({x:datetime,y:(field["tds"]!=null)?field["tds"].toFixed(2):null})
                            vm.series[2].data.push({x:datetime,y:(field["water_temp"]!=null)?field["water_temp"].toFixed(2):null})
                            vm.series[3].data.push({x:datetime,y:(field["air_temp"]!=null)?field["air_temp"].toFixed(2):null})
                            vm.series[4].data.push({x:datetime,y:(field["humidity"]!=null)?field["humidity"].toFixed(2):null})
                            vm.series[5].data.push({x:datetime,y:(field["co2"]!=null)?field["co2"].toFixed(2):null})
                        }
                        console.log("new statistic! data len =",vm.series[0].data.length)
                        vm.loading_charts=false;
                        vm.min_date=datetime
                        datetime=new Date(datetime)
                        datetime.setDate(datetime.getDate()-7)
                        vm.max_date=datetime.getTime()
                        
                        // vm.series[0]={data:new_data}

                    }
                    else if(data["timetable"]!=undefined){
                        data=data["timetable"]
                        vm.timetable={dates:[],params:[]}
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
                        vm.calendar_attributes[2].dates=[]
                        vm.calendar_attributes[3].dates=[]
                        vm.updateNowDate()
                        vm.showTimetableParams(new Date())
                        vm.changed_timetable={}
                        vm.loading_timetable=false
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
            this.showTimetableParams(day.date)
        },
        showTimetableParams(day){
            let index=-1
            console.log(this.changed_timetable[new Date(day).toLocaleDateString()])
            if (this.changed_timetable[new Date(day).toLocaleDateString()]==undefined){
                console.log("no change")
                for (let i in this.timetable.dates){
                    if (this.timetable.dates[i]==new Date(day).toDateString()){
                        index=i
                    }
                }
                day=new Date(day).toLocaleDateString()
                if(index==-1){
                    console.log("None")
                    this.selected_timetable.date=day
                    this.selected_timetable.solution1=null
                    this.selected_timetable.solution2=null
                    this.selected_timetable.solution3=null
                    this.selected_timetable.co2=null
                    this.selected_timetable.light_on_time=null
                    this.selected_timetable.light_off_time=null
                    this.selected_timetable.is_deleted=false
                }
                else{
                    console.log(this.timetable.params[index])
                    console.log(this.timetable.dates[index])
                    
                    this.selected_timetable.date=day
                    this.selected_timetable.solution1=this.timetable.params[index].solution1
                    this.selected_timetable.solution2=this.timetable.params[index].solution2
                    this.selected_timetable.solution3=this.timetable.params[index].solution3
                    this.selected_timetable.co2=this.timetable.params[index].co2
                    this.selected_timetable.light_on_time=this.timetable.params[index].light_on_time
                    this.selected_timetable.light_off_time=this.timetable.params[index].light_off_time
                    this.selected_timetable.is_deleted=false
                }
            }else{
                console.log("change")
                day=new Date(day).toLocaleDateString()
                this.selected_timetable.date=day
                this.selected_timetable.solution1=this.changed_timetable[day].data.solution1
                this.selected_timetable.solution2=this.changed_timetable[day].data.solution2
                this.selected_timetable.solution3=this.changed_timetable[day].data.solution3
                this.selected_timetable.co2=this.changed_timetable[day].data.co2
                this.selected_timetable.light_on_time=this.changed_timetable[day].data.light_on_time
                this.selected_timetable.light_off_time=this.changed_timetable[day].data.light_off_time
                this.selected_timetable.is_deleted=this.changed_timetable[day].action=="delete"
                console.log("tt "+this.changed_timetable[day].action)
            }
        },
        updateNowDate(){
            this.now_date_interval=setInterval(()=>{
                this.calendar_attributes[0].dates=new Date()
            },1000)
        },
        resetParameters(date=null){
            console.log("reset")
            if(date==null){
                this.changed_timetable={}
            }
            else{
                delete this.changed_timetable[date]
            }
            this.showChangedTimetable()
            let dt=this.selected_timetable.date.split('.')
            dt=new Date(dt[2]-0,dt[1]-1,dt[0]-0)
             this.showTimetableParams(dt)
        },
        deleteParameters(date){
            let dt=date.split('.')
            dt=new Date(dt[2]-0,dt[1]-1,dt[0]-0)
            if (this.timetable.dates.indexOf(dt.toDateString())!=-1){
                if(this.changed_timetable[date]==undefined){
                    let data={}
                    for(let i in this.timetable.params[this.timetable.dates.indexOf(dt.toDateString())]){
                        data[i]=this.timetable.params[i]
                    }
                    this.changed_timetable[date]={action:"delete",data:data}
                }else{
                    if (this.changed_timetable[date].action=="delete"){
                        this.changed_timetable[date].action="change"
                    }else{
                        this.changed_timetable[date].action="delete"
                    }
                }
                this.showChangedTimetable()
                this.showTimetableParams(dt)
            }
        },
        saveParameters(){
            this.loading_timetable=true
            for (let i in this.changed_timetable){
                if(this.changed_timetable[i].action=="change"){
                    delete this.changed_timetable[i].data.is_deleted
                    // let d=this.changed_timetable[i].data.date
                    // d=d.split(".")
                    // console.log("d="+d)
                    // this.changed_timetable[i].data.date=d[2]+"-"+d[1]+"-"+d[0]
                }
            }
            this.sendMessage("save_timetable",JSON.stringify(this.changed_timetable))
        },
        showChangedTimetable(){
            let changed_dates=[]
            let deleted_dates=[]
            for (let i in this.changed_timetable){
                let date=i.split('.')
                if(this.changed_timetable[i].action=="change"){
                    changed_dates.push(new Date(date[2]-0,date[1]-1,date[0]-0))
                }
                else if(this.changed_timetable[i].action=="delete"){
                    deleted_dates.push(new Date(date[2]-0,date[1]-1,date[0]-0))
                }
            }
            this.calendar_attributes[2].dates=changed_dates
            this.calendar_attributes[3].dates=deleted_dates
        }
    },
    computed:{
        inputListeners: function(){
            var vm = this
            return Object.assign({},
            { 
                input: function(event){
                    console.log(event.target.id)
                    console.log("input")
                    let data={}
                    for (let i in vm.selected_timetable){
                        data[i]=vm.selected_timetable[i]
                        console.log(i+"="+vm.selected_timetable[i])
                    }
                    vm.changed_timetable[vm.selected_timetable.date]={action:"change",data:data}
                    // delete vm.changed_timetable[vm.selected_timetable.date].date
                    vm.showChangedTimetable()
                }
            }
            )
        }
    },
    // watch:{
    //     selected_timetable:{
    //         handler: function(val, old_val){
    //             console.log("val:"+val+" old val:"+old_val)
    //         },
    //         deep:true
    //     }
        // selected_timetable:[
        //     'handle1',
        //     function handle2(val, old_val){
        //         console.log("h2")
        //     },
        //     {
        //     handle:function handle3(val, old_val){
        //         console.log(3)
        //     }
        //     }
        // ]
    // },
}
</script>

<style scoped>
    .grey_border{
        border: 2px solid #828282;
        border-radius: 10px;
    }
    .s_indicator_name{
        margin-top: 0.7em;
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
    .bin{
        /* margin-top: 0.5em; */
        /* float: right; */
        /* margin-right: 0.5em; */
    }
    .del_button{
        transition: transform 0.3s ease;
        /* background-color: grey; */
    }
    .del_button:hover{
        /* background-color: red; */
        transform: scale(1.3,1.3);
    }
    .del_button_activate{
        transition: transform 0.3s ease;
        filter: saturate(4500%) hue-rotate(145deg) brightness(100%) contrast(100%);
    }
    .del_button_activate:hover{
        transform: scale(1.3,1.3);
        filter: saturate(4500%) hue-rotate(145deg) brightness(100%) contrast(100%);
    }
    .disabled_input{
        pointer-events: none;
        opacity: .65;
    }
    
</style>
