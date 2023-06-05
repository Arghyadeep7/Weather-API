const express=require("express");
const app=express();
const path=require("path");
const https=require("https");

const axios=require("axios");

app.listen(process.env.PORT || 3000,()=>{
    console.log("Connection Successful!");
});

app.use(express.json());

app.use(express.urlencoded({extended:true}));

require('dotenv').config();

app.use(express.static(path.join(__dirname,"./client/build")));

app.get('*',(req,res)=>{
    res.sendFile(
        path.join(__dirname,"./client/build/index.html"),(err)=>{
            if(err){
                res.status(500).json(err);
            }
        }
    );
});

app.post("/getWeather", (req, res, next) => {
    
    const cities = req.body.cities;
    const result = {};
  
    // Create an array of promises for each city's API request
    const apiRequests = cities.map((city) => {
      return axios
        .get(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&appid=" +
            process.env.API_KEY +
            "&units=metric"
        )
        .then((response) => {
          const data = response.data;
          const temp = data.main.temp;
          result[city] = temp;
        })
        .catch((error) => {
          console.log(error);
          result[city] = "City not found";
        });
    });
  
    // Wait for all promises to resolve using Promise.all
    Promise.all(apiRequests)
      .then(() => {
        // All API requests have completed
        return res.json({weather:result});
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "An error occurred" });
      });
  });
  