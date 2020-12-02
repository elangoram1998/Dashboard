const express=require('express');
const cors=require('cors');
const user=require('./routes/users');

require('./db/mongoose');

const app=express();

app.use(express.json());
app.use(cors());

app.use('/user',user);

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}.....`);
})
