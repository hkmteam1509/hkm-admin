const BrandService = require("../services/BrandService");
const CategoryService = require("../services/CategoryService");
const ProductService = require("../services/ProductService");

class HomeController{

    //[GET] /
    index(req, res, next){
        if(req.user){
            let brandQuery = "";
            if(req.query){
                brandQuery = req.query.brand ? req.query.brand : "";
            }
            console.log(brandQuery);
            BrandService.findBrand(brandQuery)
            .then(result=>{
                let brandID = null;
                if(result){
                    brandID = result.brandID;
                }
                Promise.all([ 
                    BrandService.listAll(), 
                    CategoryService.listAll(),
                    ProductService.listBestSelling(10, brandID)
                ])
                .then(([brands, cates, products])=>{
                    const productLength=products.length;
                    let detailPromises=[];
                    for (let i=0;i<productLength;i++){
                        detailPromises.push(ProductService.getImageLink(products[i].proID));
                        detailPromises.push(ProductService.getProductDetail(products[i].proID));
                        detailPromises.push(ProductService.getCateName(products[i].catID));
                        detailPromises.push(ProductService.getBrandSlug(products[i].brandID));
                        detailPromises.push(ProductService.getCateSlug(products[i].catID));
                    }
                
                    //Chuẩn bị render
                    Promise.all(detailPromises)
                    .then(result=>{
                        for (let i=0;i<productLength;i++){
                            products[i].No = i + 1;
                            products[i].image=result[i*5][0].proImage;
                            products[i].detail=result[i*5+1];
                            products[i].cate=result[i*5+2].catName;
                            products[i].brandslug=result[i*5+3].brandSlug;
                            products[i].cateslug=result[i*5+4].catSlug;
                            products[i].genderslug=getGenderSlug(products[i].sex)
                        }
                        let firstProducts = [];
                        let lastProducts = [];
                        for(let i = 0 ; i < productLength && i < 5 ; i ++){
                            firstProducts[i] = products[i];
                        }
                        if(productLength > 5){
                            for(let i = 5 ; i < productLength; i++){
                                lastProducts[i] = products[i];
                            }
                        }
                        res.render('home', {
                            selectBrandQuery: brandID,
                            brands,
                            cates,
                            firstProducts,
                            lastProducts,
                            bestProduct: products[0] ? products[0] : null,
                        });
                            
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                })
                .catch(err=>{
                    console.log(err);
                    next();
                })
            })

        }
        else{
            res.redirect("/account/login");
        }
    }

    //[404]
    error404(req, res,next){
        res.render("404");
    }

}
function getGenderSlug(sex) {
	let gender="unisex";
	if (sex==1)
		gender="women";
	if (sex==0)
		gender="men";
	return gender;
}

module.exports = new HomeController;