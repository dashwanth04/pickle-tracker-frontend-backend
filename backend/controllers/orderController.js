const Order = require("../models/Order");

exports.addOrder = async (req,res)=>{
 try{
   const order = new Order(req.body);
   await order.save();
   res.json(order);
 }catch(err){
   res.status(500).json({error:err.message});
 }
};

exports.getOrders = async (req,res)=>{
 try{
   const orders = await Order.find();
   res.json(orders);
 }catch(err){
   res.status(500).json({error:err.message});
 }
};

exports.deleteOrder = async (req,res)=>{
 try{
   await Order.findByIdAndDelete(req.params.id);
   res.json({message:"Order deleted"});
 }catch(err){
   res.status(500).json({error:err.message});
 }
};

exports.dailySales = async (req,res)=>{
 try{
   const sales = await Order.aggregate([
     {
       $group:{
         _id:"$date",
         totalSales:{ $sum:"$total"}
       }
     }
   ]);
   res.json(sales);
 }catch(err){
   res.status(500).json({error:err.message});
 }
};