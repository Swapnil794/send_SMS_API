const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const ejs = require('ejs');
const Vonage = require('@vonage/server-sdk');

// app init
const app = express();

// init vonage
const vonage = new Vonage({
    apiKey:'85c1c6f7',
    apiSecret:'m2My0fbSwv3TNVRl'
},{debug:true})

// temlate engine setup
app.set('view engine','html');
app.engine('html',ejs.renderFile);

// public folder setup
app.use(express.static(__dirname+'/public'));

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// index route
app.get('/',(req,res)=>{
    res.render('index');
})
// catch from submit
app.post('/',(req,res)=>{
    const number = req.body.number;
    const text = req.body.text
    console.log(`9001 ${number} ${text}`);
    vonage.message.sendSms('916397241779',number,text,{type:'unicode'},
    (err,responseData)=>{
        if(err){
            console.log(err);
        }else{
            const { messages } = responseData;
            const { ['message-id']: id, ['to']: number, ['error-text']: error  } = messages[0];
            console.dir(responseData);
            if (responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
              } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
            // Get data from response
            const data = {
                id,
                number,
                error
            };
            io.emit('smsStatus',data);
        }
    })
})
// define port
const Port = 2800

// starting server
const server = app.listen(Port,()=>{
    console.log(`server starting on port : ${Port}`);
});

// connect to socket.io
const io= socket(server);
io.on('coonection',(socket)=>{
    console.log('coonected');
    io.on('disconnect',()=>{
        console.log('disconnected');
    })
})