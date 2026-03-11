import { asynchandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { APIResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/ProductModel/productmodel.js";
import { getPublicIdFromUrl
       , uploadOncloudinary 
  , deleteFromCloudinary
} from "../utils/cloudinaryconnect.js";

export const createProduct = asynchandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category, 
    tags,
    stock,
    author
  } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "Product title is required");
  }

  if (!description || description.trim() === "") {
    throw new ApiError(400, "Product description is required");
  }
  if (!category || category.trim() === "") {
    throw new ApiError(400, "Product category is required");
  }
  if (!price || isNaN(price) || Number(price) < 0) {
    throw new ApiError(400, "Valid product price is required");
  }
  if (!author || author.trim() === "") {
    throw new ApiError(400, "Product author is required");
  }

  let thumbnailUrl = "";
let productImages = [];

if (req.files.product_thumbnails?.[0]) {
  const uploadResult = await uploadOncloudinary(
    req.files.product_thumbnails[0].path,
    "product_thumbnails"
  );
  thumbnailUrl = uploadResult.secure_url;
}

if (req.files.product_images?.length > 0) {
  for (const file of req.files.product_images) {
    const uploadResult = await uploadOncloudinary(file.path, "product_images");
    productImages.push(uploadResult.secure_url);
  }
}

  const newProduct = new Product({
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    price: Number(price),
    product_thumbnails: thumbnailUrl,
    product_images: productImages,
    author : author.trim(),
    tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    stock: stock ? Number(stock) : 100,
    sellerId : req.user._id
    
  });

  await newProduct.save();
  console.log("New product created:", newProduct);
  res
    .status(201)
    .json(new APIResponse(true, "Product created successfully", newProduct));
});

export const updateProduct = asynchandler(async (req, res) => {
  const productId = req.params.id;
  const {
    title,
    description,
    price,
    category, 
    tags,
    stock,
    author
  } = req.body;
//if no file provided initialize req.files to empty object
  if (!req.files) req.files = {};

  if(!productId){
    throw new ApiError(400,"product id is required")
  }

  const product = await Product.findById(productId);

  if(!product){
    throw new ApiError(404,"no product found")
  }

  const old_thumbnail = product.product_thumbnails;
  if(!old_thumbnail){
    throw new ApiError(500,"old thumbnail not found")
  } 
  let newthumbnailUrl = "";
  let newproductImages = [];

  //here we will upload new images and thumbnail if provided
  if (req.files.product_thumbnails?.[0]) {
  const uploadResult = await uploadOncloudinary(
    req.files.product_thumbnails[0].path,
    "product_thumbnails"
  );
  //new thumbnail url
  newthumbnailUrl = uploadResult.secure_url;
  
//code to delete old thumbnail from cloudinary 
  if(old_thumbnail){
    
    const old_thumbnail_id =  await getPublicIdFromUrl(old_thumbnail);
    if(!old_thumbnail_id){   
      throw new ApiError(500,"old thumbnail id not found")
    } 
      deleteFromCloudinary(old_thumbnail_id);
  }
}
  const old_product_images = product.product_images;
//upload new product images if any
if (req.files.product_images?.length > 0) {
  for (const file of req.files.product_images) {
    const uploadResult = await uploadOncloudinary(file.path, "product_images");
    newproductImages.push(uploadResult.secure_url);
  }

  //code to delete old product images from cloudinary
  if(old_product_images && old_product_images.length > 0){
    for(const old_image_url of old_product_images){
      const old_image_id =  await getPublicIdFromUrl(old_image_url);
      if(!old_image_id){   
        throw new ApiError(500,"old product image id not found")
      } 
        deleteFromCloudinary(old_image_id);
    }
  }
}

//updating the product details

  const updatedproduct = await Product.findByIdAndUpdate(
    product._id, {
      $set : {
        title: title ? title.trim() : product.title,
        description: description ? description.trim() : product.description,
        category: category ? category.trim() : product.category,
        price: price ? Number(price) : product.price,
        author : author ? author.trim() : product.author,
        tags: tags ? tags : product.tags,
        stock: stock ? Number(stock) : product.stock,
        product_thumbnails: newthumbnailUrl.trim() !== "" ? newthumbnailUrl : product.product_thumbnails,
        product_images: newproductImages.length > 0 ? newproductImages : product.product_images,
    }  
  },{
    new: true,
  })

  if(!updatedproduct){
    throw new ApiError(404,"product not updated")
  }

return res.status(200)
   .json(new APIResponse(200,"product updated successfully",updatedproduct))
});

export const deleteProduct = asynchandler(async (req, res) => {

  const productId = req.params.id; 
  if(!productId){
    throw new ApiError(400,"product id is required")
  }   
  const product = await Product.findById(productId);

  if(!product){
    throw new ApiError(404,"no product found")
  } 
  const old_thumbnail = product.product_thumbnails;
  if(!old_thumbnail){
    throw new ApiError(500,"old thumbnail not found")
  }

  const product_images = product.product_images;

  //deleting old thumbnail from cloudinary
  const old_thumbnail_id =  await getPublicIdFromUrl(old_thumbnail);
  if(!old_thumbnail_id){   
    throw new ApiError(500,"old thumbnail id not found")
  } 
   await deleteFromCloudinary(old_thumbnail_id); 

  //deleting old product images from cloudinary
  if(product_images && product_images.length > 0){
    for(const old_image_url of product_images){
      const old_image_id =  await getPublicIdFromUrl(old_image_url);
      if(!old_image_id){   
        throw new ApiError(500,"old product image id not found")
      } 
        await deleteFromCloudinary(old_image_id);
    }
  }

  await Product.findByIdAndDelete(productId);

  return res.status(200)
     .json(new APIResponse(200,"product deleted successfully"));

});
export const getSellerProducts = asynchandler(async (req, res) => {
 console.log(req.user);
  const sellerId =  req.user._id;
 console.log(sellerId);
  const products = await Product.find({ sellerId });
  console.log(products);
  return res.status(200).json(
    new APIResponse(200, "Seller products fetched successfully", products)
  );

});

export const getAllProducts = asynchandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const category = req.query.category;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const search = req.query.search;

  let filter = {};

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(filter)
  ]);

  return res.status(200).json(
    new APIResponse(200, "Products fetched successfully", {
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit)
      }
    })
  );
});

export const searchProducts = asynchandler(async (req, res) => {
  const query = req.query.q || req.query.title || " ";    // search query from request

  if (!query ) {
    throw new ApiError(400, "Search query cannot be empty");
  }

  const products = await Product.find({
    $or: [
      { title: { $regex: query, $options: "i" } },  // case-insensitive search in title
      { description: { $regex: query, $options: "i" } }, // case-insensitive search in description
      { tags: { $regex: query, $options: "i" } }, // case-insensitive search in tags
    ],
  });

  if(!products || products.length === 0){
    throw new ApiError(404,"no products found matching the search query")
  }
  return res.status(200).json(
    new APIResponse(200, "Search results fetched successfully", products)
  );
});

// export const getProductsByCategory = asynchandler(async (req, res) => {
//   const category = req.params.category; 
//   if (!category || category.trim() === "") {
//     throw new ApiError(400, "Category is required");

//   }const product = await Product.find({ category: category.trim() });

//     if(!product || product.length === 0){
//       throw new ApiError(404,"no products found in this category")
//     }   

//     return res.status(200).json( new APIResponse(200, "Products fetched successfully", product) );
//   });

  export const getProductById = asynchandler(async (req, res) => {
    const productId = req.params.id;  
    console.log("yes");
    if(!productId){
      throw new ApiError(400,"product id is required")
    }   
    const product = await Product.findById(productId);

    if(!product){
      throw new ApiError(404,"no product found")
    }   
    return res.status(200).json( new APIResponse(200, "Product fetched successfully", product) );
  });
export default { createProduct,updateProduct ,getSellerProducts, deleteProduct , getAllProducts,searchProducts , getProductById};
