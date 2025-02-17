import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";



// product 
    // Add Products 
    // Edit Products
    // Delete Products
    // Manage Inventory
    // Bulk Upload Products !

// Order Management
    // View Orders
    // Update Order Status
    // Generate Invoices
    // Cancel/Refund Orders

// Customer Management
    // View Customer Details
    // Communicate with Customers
    // Analytics and Reports
    // Sales Analytics
    // Customer Insights
    // Inventory Reports

// Promotions and Discounts
    // Create Discounts and Offers
    // Schedule Sales

// Review and Feedback Management
    // Moderate Reviews
    // Respond to Feedback

// Settings
    // Profile Management
    // Shipping Settings
    // Tax Settings

const getAllProduct = asyncHandler(async(req,res)=>{
    const {page =1, limit = 10, sortBy, sorType, userId, query } = req.query;

    const options = {
        page: parseInt(page,10),
        limit: parseInt(limit,10),
        sort: {[sortBy]:sorType  === "asc" ? 1:-1}
    }

    const productMatPagination = Product.aggregate([
        {
            $match:{
                $or:[
                    {
                        ...(userId && {
                            owner: new mongoose.Types.ObjectId(userId)
                        })
                    },
                    {
                        ...(query && {
                            title: { $regex: query, $options: 'i'}
                        } )
                    },
                    {
                        ...(query && {
                            description : {$regex: query, $options: "i"}
                        })
                    },
                ]
            }
        }
    ]);

    const response = await Product.aggregatePaginate(productMatPagination,options);

    return res.status(200).json(
        new ApiResponse(
            200,
            response,
            "All product fetched successfully based on page "
        )
    );

})

const addProduct = asyncHandler(async(req,res)=>{
    const {name, title, description, tags, price, stock, category, fragranceType, brand} = req.body;
    
    if([name, title, description, price, stock, category, fragranceType, brand].some((fields)=> fields.trim() === "")) throw new ApiError(400, "Fill all required fields ");

    // const imagePath = req.files.images[0]?.path;
    
    const uploadPromises = req.files.images?.map(async(imagePath)=>{
       
       return await uploadOnCloudinary(imagePath?.path)
    })

    const urls = await Promise.all(uploadPromises);
    const e = urls.map((data,idx)=>{
        return data?.url;
    })

    const productAdded = await Product.create({
        name,
        title,
        description, 
        tags, 
        brand,
        price, 
        stock, 
        category, 
        fragranceType, 
        images: e,
        owner:req.user
    });
    const product = await Product.findById(productAdded._id)

    if(!product) throw new ApiError(400, "something went wrong while adding product");

    return res
    .status(200)
    .json(new ApiResponse(200, product, "Product added successfully"));

});

const updateProduct = asyncHandler(async(req,res)=>{
    const {productId} = req.params;
    const {name, title, description, tags, price, stock, category, fragranceType, brand} = req.body;
    
    if([name, title, description, price, stock, category, fragranceType, brand].some((fields)=> fields.trim() === "")) throw new ApiError(400, "Fill all required fields ");

    if(!productId) throw new ApiError(401, "product id is required");

    if(!isValidObjectId) throw new ApiError(401, "Product id is not valid");
    
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set:{
                name:name,
                title:title,
                description:description, 
                tags:tags, 
                brand:brand,
                price:price, 
                stock:stock, 
                category:category, 
                fragranceType:fragranceType,
            }
        },{
            new:true
        }
    );

    if(!updatedProduct) throw new ApiError(400, "something went wrong while updating product details");

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedProduct,"Product details updated successfully")
    )

})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {productId} = req.params;

    if(!productId) throw new ApiError(401, "Product id is required");
    if(!isValidObjectId) throw new ApiError(401, "Product id is not valid");

    await Product.findByIdAndDelete(productId);

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Product has been deleted successfully ")
    )
});

const getProductById = asyncHandler(async(req,res)=>{
    const {productId} = req.params;

    if(!productId) throw new ApiError(401, "Product id is required");
    
    if(!isValidObjectId(productId)) throw new ApiError(401, "Product id is not valid");

    const product = await Product.findById(productId);

    return res
    .status(200)
    .json(
        new ApiResponse(200, product, "Successfully fetched product by id ")
    )
});




export {addProduct,updateProduct, deleteProduct, getProductById,getAllProduct}