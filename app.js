console.log("Starting app...")
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = 8081;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!
let interval;

io.on("connect", socket => {
  console.log("New client connected");
  socket.emit("poop", "pooped on " + Math.random())
  //interval = setInterval(() => getApiAndEmit(socket), 10000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  socket.on('imonline', (data)=>{
      console.log('im online')
      console.log(data)
  })
  socket.on('batchpushed', (data)=>{
    console.log(data)
  })
});
io.on("poop", () =>{
    console.log('pooped on')
})
io.on("DataFarmerDocked", socket => {
    console.log("Data Farmer reporting for duty")
    socket.emit("echo", "hello df")
})
server.listen(port,'0.0.0.0', () => console.log(`Listening on port ${port}`));

const getApiAndEmit = async socket => {
    try {
      const res = await axios.get(
        "https://api.darksky.net/forecast/PUT_YOUR_API_KEY_HERE/43.7695,11.2558"
      ); // Getting the data from DarkSky
      socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  };
