const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/Users");
const Product = require("./db/Product");
//jwt 
const Jwt = require('jsonwebtoken');
const Jwtkey = 'e-comm'
const app = express();
//body parsing
app.use(express.json());
app.use(cors());

//sign api
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
  console.log("api is working", result);
});

//login api
app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      //token using start
      // Jwt.sign({user},Jwtkey,{expiresIn:"2h"},(err,token)=>{
      //   if(err){
      //     res.send("Something went wrong Please Trt After some time")
      //   }
      //   res.send({user,auth:token})
      // })
      res.send(user);
      //token using end

    } else {
      res.send({ result: "No user Found" });
    }
  }
});

//add product api
app.post("/add-product", async (req, res) => {
  let products = new Product(req.body);
  let response = await products.save();
  res.send(response);
});
//get product
app.get("/products", async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No Products Found" });
  }
});
//delete Products
app.delete('/product/:id',async (req,res)=>{
    let result = await Product.deleteOne({_id:req.params.id})
    res.send(result)
})
//get one product details
app.get('/product/:id',async (req,res)=>{
     let result = await Product.findOne({_id:req.params.id})
     if(result){
      res.send(result)
     }else {
      res.send({ result: "No Products Found" });
    }
})

//update Product 
app.put('/product/:id',async (req,res)=>{
  let result = await Product.updateOne(
    {_id:req.params.id},
    {$set:req.body}
    )
    res.send(result)
})

//Search Product
app.get('/search/:key',async (req,res)=>{
  let result = await Product.find({
   "$or":[
    {name:{$regex:req.params.key}},
    {price:{$regex:req.params.key}},
    {category:{$regex:req.params.key}},
    {company:{$regex:req.params.key}},
   ]
  })
  res.send(result)
})
//just for checking
app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce API!");
});
app.listen(5000);
