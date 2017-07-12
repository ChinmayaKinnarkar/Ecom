var express = require('express');
var mongoose = require('mongoose');
var auth = require('../../middlewares/auth.js');
var userRouter = express.Router();
var productModel = mongoose.model('product');
var responseGenerator = require('../../lib/responseGenerator');

module.exports.controller = function (app){
	
	//view template of create a product
	userRouter.get('/products/create',auth.isLoggedIn,function(req,res) {
		res.render('create-product');

	});

//route to edit product
userRouter.get('/products/edit',auth.isLoggedIn,function (req,res) {
	res.render('edit-product');
});

//route to delete product
userRouter.get('/products/delete',auth.isLoggedIn,function(req,res) {
	res.render('delete-product');
});

//router to view all products
userRouter.get('/products',auth.isLoggedIn,function(req,res){
	productModel.find(function(err,result) {
		if (err) {
			var myResponse = responseGenerator.generate(true,"some error"+err,404,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		} else {
			res.render('index',{
				user:req.session.user,
				products: result
			});
		}
	});
});

//route to delete a product
userRouter.post('/delete',auth.isLoggedIn,function(req,res){ 

	productModel.findOneAndRemove({
		'productName':req.body.productName
	},function(err,foundProduct) {
		if (err) {
                var myResponse = responseGenerator.generate(true, "some error" + err, 500, null);
                res.send(myResponse);
            } else if (foundProduct == null || foundProduct == undefined || foundProduct.productName == undefined || foundProduct == '') {

                var myResponse = responseGenerator.generate(true, "product not found", 404, null);
                //res.send(myResponse);
                res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                });

            } else {

            		console.log("product deleted...");
                res.redirect('/users/products');
            }

	});
});

//route to edit a product
userRouter.get('/productedit',auth.isLoggedIn,function(req,res){
	productModel.find({'productName': req.body.productName},function(err,result) {
		if (err || result==null) {
			var myResponse = responseGenerator.generate(true,"Product not found "+err,500,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		} else  {
			res.session.product=result;
			console.log(req.session);
			res.render('edit-product');

		}
	});
});

//rest api to edit product
userRouter.post('/productedit1',auth.isLoggedIn,function(req,res) {
	productModel.find({'productName': req.body.productName},function (err,result) {
		if (err) {
			alert("Some error occurred");
			var myResponse = responseGenerator.generate(true,"Product not found "+err,500,null);
			res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
		} 
		else {
			console.log(result);
			result.productName = req.body.productName;
			result.category = req.body.category;
			result.productPrice = req.body.productPrice;
			result.save(function(err) {
			  if(err){
			  	alert("Some error occurred");
				var myResponse = responseGenerator.generate(true,"Product not found "+err,500,null);
				res.render('error',{
				message: myResponse.message,
				error: myResponse.data
			});
			}
			else{
				req.session.product = result;
				alert("Product updated");
				console.log(req.session);
				res.redirect('/user/products');
			}
				
			});
			}
			
		});
	});


//route to create a product
userRouter.post('/create',auth.isLoggedIn,function(req,res){
	 if (req.body.productName != undefined && req.body.category != undefined && req.body.productPrice != undefined) {
	 	var newProduct = new productModel({

	 		productId : Math.floor(Math.random()*100+1),
	 		productName: req.body.productName,
	 		category: req.body.category,
	 		productPrice: req.body.productPrice,
	 		model: req.body.model,
	 		color: req.body.color,
	 		brandName:req.body.brandName,
	 		createdOn: today,
	 		updatedOn: today
	 	});
	 	console.log(req.body.productName+ '' +req.body.category+ '' +req.body.productPrice+ '' +req.body.brandName+ '' +req.body.color);

	 	newProduct.save(function(err) {
	 		if (err) {
	 			alert("Some error occurred");
	 			var myResponse = responseGenerator.generate(true,"some error "+err,500,null);
	 			res.render('error',{
	 				message: myResponse.message,
	 				error: myResponse.data
	 			});
	 		} else {
	 			req.session.product = newProduct;
	 			console.log(req.session);
	 			res.redirect('/user/products');
	 		}
	 	});
}
});

userRouter.get('/dashboard',auth.isLoggedIn,function(req,res){
	res.render('dashboard',{
		user: req.session.user
	});
});

//route to log out
userRouter.get('/logout',auth.isLoggedIn,function(req,res) {
	res.session.destroy(function(err) {
		res.redirect('/users');
	});
});

app.use(function(err,req,res,next) {
	console.log(err.status);
	res.status(err.status||500);
	if(err.status==404){
		res.render('404',{
			message:err.message,
			error:err
		});
	}else{
		res.render('error',{
			message:err.message,
			error:err
		});
	}
});

app.use('/users',userRouter);
}

