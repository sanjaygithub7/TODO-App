const express=require('express')
const connectdatabase=require('./config/connectDB')
const todomodel = require('./models/todomodel');
const cors=require('cors')
const port=3000

const app=express()

app.use(express.json()) // to handle json requests in code
app.use(cors()) //handling the cors error

// memory for storing data
// const todo=[]

connectdatabase();

// create a todo item(POST)
app.post('/todo',async(req,res)=>{

    // destruchuring request(req.body api postman) from the frontend as title and description
    const {title,description}=req.body;
    
    //creating item in database

    try{
        const newtodo= new todomodel({title,description})
        await newtodo.save()
        res.status(201).json(newtodo)

    }catch(error){
       console.log(error)
       res.status(500)
    }
})

// Get all items(GET)
app.get('/todo',async(req,res)=>{

    // getting all items from database
    try{
        const todo=await todomodel.find()
        res.json(todo)

    }catch(error){
        console.log(error)
       res.status(500)

    }
})

// Updating a item
app.put('/todo/:id',async(req,res)=>{

    try{
        const {title,description}=req.body;
        const id=req.params.id
        const updated=await todomodel.findByIdAndUpdate(
            id,{title,description}
        )

        if(!updated){
            res.status(404).json({message:'Id not found'})
        }else{
            res.json(updated)
            console.log("updated ID:",req.params.id)
            console.log(`updated title is: "${title}" and description is: "${description}"`)
        }


    }catch(error){
        console.log(error)
        res.status(500)
        
    }

})


 // Deleting a item

 app.delete('/todo/:id',async(req,res)=>{

    try{
        const id=req.params.id
        const deleteditem=await todomodel.findByIdAndDelete(id)

        if(!deleteditem){
            res.status(404).json({message:"error occured in deletion"})
        }else{
            res.status(200).json({message:"item deleted successfully",DeletedID:`Deleted ID is ${req.params.id}`})
        }

    }catch(error){
        console.log(error)
        res.status(500)
    }

  

})



app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})