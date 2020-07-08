const express=require('express');
const cors=require('cors');
const pg=require('pg')
require('dotenv').config();
const PORT=process.env.PORT||3030;
const app=express();
app.use(cors());

const superagent=require('superagent');




const client=new pg.Client(process.env.DATABASE_URL);
client.connect()
.then(()=>{

    app.listen(PORT,()=>{
        console.log(`Listining to PORT: ${PORT}`);
        
    
    })
})
app.get('/location',(req,res)=>{
    
    const GEOCODE_API_KEY=process.env.GEOCODE_API_KEY;
    const city=req.query.city;
    const url=`https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`;
    const SQL0=`SELECT * FROM cities WHERE city_name=${city}`;
    const SQL1=`SELECT * FROM cities `;
    let SQL = `INSERT INTO cities (first_name,last_name) VALUES ('mmmmmm','gggggg')`
    // const SQL=`INSERT INTO cities VALUES ($1,$2,$3,$4)`;
    // const safeVAlues=city;
    // console.log("client")
    client.query(SQL)
    .then(results=>{
        res.status(200).json(results);
    })
//     client.query(SQL0)
//     .then(reslut=>{
//         if(reslut){
// // client.query(SQL,safeVAlues)
// //             .then(result2=>{
// //                 res.send(result2) 
// // res.send(reslut);
            
//         }else{
//             superagent.get(url)
//             .then(data=>{
                
//                 const location=new Locationdata(city,data.body[0])
                
//                 res.send(location)
//                 console.log(data.body)
//             })
// client.query(SQL,safeVAlues)
// .then(res)

            
//         }
//     })



    // res.send(url);
})
app.get('/weather',(req,res)=>{
const WEATHER_API_KEY=process.env.WEATHER_API_KEY;
const city=req.query.city;
let arr=[];

const url=`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${WEATHER_API_KEY}`
superagent.get(url)
.then(geodata=>{
    // console.log(geodata.body.data[0].weather.description)
    // console.log(geodata.body.data)
    geodata.body.data.map(item=>{
        // console.log(item.weather.description);
arr.push(new Weather(city,item));

    })
    res.send(arr)

    // const weather1=new Weather(city,data.body)
})
})



app.get('/trials',(req,res)=>{

    const TRAIL_API_KEY=process.env.TRAIL_API_KEY;
   
    const myId=req.query.ids;
    let arr=[];

    const url=`https://www.hikingproject.com/data/get-trails-by-id?ids=${myId}&key=${TRAIL_API_KEY}`;

    console.log("trailData.body")
 
        superagent.get(url)
        .then(traiData=>{
            // console.log(traiData.body.trails[0].name)
            traiData.body.trails.map(item=>{
                console.log(item)
                arr.push(new Trials(item))
            })
            res.send(arr)
        })
        // console.log(arr);
})
app.get('*',(req,res)=>{
    res.status(404).send("Try again don't surrender ♥, The Life is about: trail trail trail , then faild faild also faild then get up then tast the success")
})

function Trials(item){
    this.name=item.name;
    this.location=item.location;
    this.length=item.length;
    this.stars=item.stars;
    this.star_votes=item.starVotes;
    this.summary=item.summary;
    this.trail_url=item.url;
    this.conditions=item.conditionStatus;
    this.condition_date=item.conditionDate.slice(0,10);
    this.condition_time=item.conditionDate.slice(11);


}
function Weather(city,wdata){
    this.forecast=wdata.weather.description;
    this.time=wdata.datetime
}
function Locationdata(city,obj){
this.search_query=city;
this.formatted_query= obj.display_name;
this.latitude= obj.lat;
this.longitude=obj.lon;
}