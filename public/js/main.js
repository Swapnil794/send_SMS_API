const getNumberInput = document.getElementById('number'),
      textInput = document.getElementById('msg'),
      button = document.getElementById('button'),
      scheduleSelect = document.getElementById('schedule')
      response = document.querySelector('.response');

button.addEventListener('click',send,false);
const socket = io();
socket.on('smsStatus',(data)=>{
    response.innerHTML = '<h5> Text Message sent to '+data.number+'</h5>'
})

let timeout;
const getTimeSchedule = ({time,number,text})=>{
    if(timeout) clearTimeout(timeout);
    timeout = setTimeout(()=>{
        fetchServer({number,text});
    },time*60*1000);
}
function send(){
    const number = getNumberInput.value.replace(/\D/g,'');
    const text = textInput.value;
    const time = parseInt(scheduleSelect.value,10);
    getTimeSchedule({time,number,text});
}

const fetchServer = (({number,text})=>{
    fetch('/',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body : JSON.stringify({number:number,text:text})
    }).then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err);
    })
})