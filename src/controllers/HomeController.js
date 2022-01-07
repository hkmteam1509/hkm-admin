const BrandService = require("../services/BrandService");
const CategoryService = require("../services/CategoryService");
const ProductService = require("../services/ProductService");
const StatiticService = require("../services/StatiticService");
const { getQuarter, getQuarterString, getWeekYear, getStartDateOfWeek, getEndDateOfWeek } = require("../utilities/Util");


const nMonth = 10;
const nQuarter = 10;
const nYear = 10;
const nWeek = 10;
const nDate = 30;

class HomeController{

    //[GET] /
    async index(req, res, next){
        try {
            let brandQuery = "";
            if(req.query){
                brandQuery = req.query.brand ? req.query.brand : "";
            }
            console.log(brandQuery);
            const brand = await BrandService.findBrand(brandQuery);
            let brandID = null;
            if(brand){
                brandID = brand.brandID;
            }
            const [brands, cates, products] = await Promise.all([ 
                BrandService.listAll(), 
                CategoryService.listAll(),
                ProductService.listBestSelling(10, brandID)
            ]);
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
            const result = await Promise.all(detailPromises);
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
            let currentYear = new Date().getFullYear();
            const orderPromise = [];
            const statiticData = [];
            for(let i = 0 ;i < nYear; i++){
                statiticData.push({year: (currentYear - i).toString()});
                orderPromise.push(StatiticService.getOrderDetailByYear(currentYear - i));
            }
            const orders = await Promise.all(orderPromise);
            const productPromise = [];
            orders.forEach((orderYear, index)=>{
                const a = [];
                orderYear.forEach((order, index1)=>{
                    a.push(StatiticService.getProduct(order.proID));
                });
                productPromise.push(Promise.all(a));
            })
            const orderProducts = await Promise.all(productPromise);
            for(let i = 0 ;i < nYear; i++){
               statiticData[i].value = 0;
               for(let j = 0 ; j < orderProducts[i].length; j ++){
                statiticData[i].value += orderProducts[i][j].price*orders[i][j].quantity;
               }
            }
            res.render('home', {
                selectBrandQuery: brandID,
                brands,
                cates,
                firstProducts,
                lastProducts,
                statiticData,
                bestProduct: products[0] ? products[0] : null,
            });
        } catch (error) {
            console.log(error);
            next();
        }
       
    }

    async getBestSelling(req, res, next){
        try {
            let brandQuery;
            if(req.query){
                brandQuery = req.query.brand ? req.query.brand : "";
            }
            const brand = await BrandService.findBrand(brandQuery);
            let brandID = null;
            if(brand){
                brandID = brand.brandID;
            }
            const products = await ProductService.listBestSelling(10, brandID)
            const productLength=products.length;
            let detailPromises=[];
            for (let i=0;i<productLength;i++){
                detailPromises.push(ProductService.getImageLink(products[i].proID));
                detailPromises.push(ProductService.getProductDetail(products[i].proID));
                detailPromises.push(ProductService.getCateName(products[i].catID));
                detailPromises.push(ProductService.getBrandSlug(products[i].brandID));
                detailPromises.push(ProductService.getCateSlug(products[i].catID));
            }
        
            const result = await Promise.all(detailPromises);
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
            res.status(200).json({
                firstProducts,
                lastProducts,
                bestProduct: products[0] ? products[0] : null,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    async getStatitic(req,res,next){
        let type = 0, type1 = 0;
        if(req.query){
            type = (req.query.type) ? (req.query.type) : 0
            type1 = (req.query.type1) ? (req.query.type1) : 0
        }
        type = parseInt(type);
        type1 = parseInt(type1);
        const orderPromise = [];
        const statiticData = [];
        let current = new Date();
        if(type === 0){
            for(let i = 0 ;i < nYear; i++){
                statiticData.push({year: (current.getFullYear() - i).toString()});
                orderPromise.push(StatiticService.getOrderDetailByYear(current.getFullYear() - i));
            }
        }else if (type === 1){
            let lastQuarter = getQuarter(current);
            let lastYear = current.getFullYear();
            for(let i = 0; i < nQuarter; i++){
                if(lastQuarter <= 0){
                    lastYear--;
                    lastQuarter = 4;
                }
                let startDate = new Date(lastYear, (lastQuarter - 1)*3, 1);
                let endDate = new Date(lastYear, lastQuarter*3-1,1);
                statiticData.push({quarter: lastYear + " Q" + lastQuarter});
                orderPromise.push(StatiticService.getOrderDetailByQuarter(startDate, endDate));
                lastQuarter--;
            }
        }else if(type === 2){
            let lastMonth = current.getMonth() + 1;
            let lastYear = current.getFullYear();
            for(let i = 0; i < nMonth; i++){
                if(lastMonth <= 0){
                    lastYear--;
                    lastMonth = 12;
                }
                
                statiticData.push({month: lastYear + "-" + lastMonth});
                orderPromise.push(StatiticService.getOrderDetailByMonth(lastMonth, lastYear));
                lastMonth--;
            }
        }else if(type === 3){
            let lastWeek = getWeekYear(current);
            let lastYear = current.getFullYear();
            for(let i = 0; i < nWeek; i++){
                if(lastWeek <= 0){
                    lastYear--;
                    lastWeek = 52;
                }
                let startDate = getStartDateOfWeek(lastWeek, lastYear);
                let endDate = getEndDateOfWeek(lastWeek, lastYear);
                statiticData.push({week: lastYear + " W" + lastWeek});
                orderPromise.push(StatiticService.getOrderDetailByWeek(startDate, endDate));
                lastWeek--;
            }
        }else if(type === 4){
            const currentDate = new Date().setDate(25);
            for(let i = 0; i < nDate; i++){
                let d = new Date(currentDate);
                d.setDate(d.getDate() - i);
                let startDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0);
                let endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23,59,59);
                statiticData.push({day: d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate()});
                orderPromise.push(StatiticService.getORderDetailByDate(startDate, endDate));
            }
        }
        try {
            const orders = await Promise.all(orderPromise);
            const productPromise = [];
            orders.forEach((orderYear)=>{
                const a = [];
                orderYear.forEach((order)=>{
                    a.push(StatiticService.getProduct(order.proID));
                });
                productPromise.push(Promise.all(a));
            });
            const orderProducts = await Promise.all(productPromise);
            if(type1 === 0){
                for(let i = 0 ;i < orders.length; i++){
                    statiticData[i].value = 0;
                    for(let j = 0 ; j < orderProducts[i].length; j ++){
                        statiticData[i].value += orderProducts[i][j].price*orders[i][j].quantity;
                    }
                }
                
                res.status(200).json({statiticData});
            }else if(type1 === 1){
                const brands = await StatiticService.getAllBrand();
                for(let i = 0 ; i < orders.length; i++){
                    brands.forEach(brand=>{
                        statiticData[i][brand.brandName] = 0;
                    });
                }
                for(let i = 0 ; i < orders.length; i++){
                    for(let j = 0 ; j < orderProducts[i].length ; j++){
                        brands.forEach(brand=>{
                            if(orderProducts[i][j].brandID === brand.brandID){
                                statiticData[i][brand.brandName] += orderProducts[i][j].price*orders[i][j].quantity;
                            }
                        });
                    }
                }
                
                res.status(200).json({statiticData, brands});
            }else if(type1 === 2){
               const genders = [{genderID: 1, genderName: "Women"}, {genderID: 0, genderName: "Men"},{genderID: 2, genderName: "Unisex"}];
               for(let i = 0 ; i < orders.length; i++){
                    genders.forEach(gender=>{
                        statiticData[i][gender.genderName] = 0;
                    });
                }
                for(let i = 0 ; i < orders.length; i++){
                    for(let j = 0 ; j < orderProducts[i].length ; j++){
                        genders.forEach(gender=>{
                            if(orderProducts[i][j].sex === gender.genderID){
                                statiticData[i][gender.genderName] += orderProducts[i][j].price*orders[i][j].quantity;
                            }
                        });
                    }
                }
                res.status(200).json({statiticData, genders});
            }else if(type1 === 3){
                const cats = await StatiticService.getAllCate();
                for(let i = 0 ; i < orders.length; i++){
                    cats.forEach(cat=>{
                        statiticData[i][cat.catName] = 0;
                    });
                }
                for(let i = 0 ; i < orders.length; i++){
                    for(let j = 0 ; j < orderProducts[i].length ; j++){
                        cats.forEach(cat=>{
                            if(orderProducts[i][j].catID === cat.catID){
                                statiticData[i][cat.catName] += orderProducts[i][j].price*orders[i][j].quantity;
                            }
                        });
                    }
                }
                
                res.status(200).json({statiticData, cats});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
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