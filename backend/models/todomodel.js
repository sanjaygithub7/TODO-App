const mongoose =require('mongoose')

const todoschema= new mongoose.Schema({
    title:String,
    description:String
})


const todomodel=mongoose.model('Todo',todoschema)

module.exports=todomodel