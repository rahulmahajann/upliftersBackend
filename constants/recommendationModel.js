const ContentBasedRecommender = require("content-based-recommender");
const TfIdf = require('tf-idf-search');
const { getVideoDataSet, getProductDataSet } = require("./functions");
const tf_idf = new TfIdf();

let videos, products;

// key -> 0 -> video, 1->product
async function recommendItems(key, noOfItems) {
  const probabilityOfChoosingShop = Math.floor(Math.random() * 100) + 1;
  const recommender = new ContentBasedRecommender();
  if (probabilityOfChoosingShop <= 50) {
    // video
    // access  interaction from database
    console.log(probabilityOfChoosingShop,"video");
    if (key) {
        videos = await getVideoDataSet();
        products = await getProductDataSet();
        await recommender.trainBidirectional(videos, products);
    } else {
        videos = await getVideoDataSet();
      await recommender.train(videos);
    }
    // access video interaction from db
    // User Interaction on Videos from DB
    const UIV = [{id:"1000001",score:12},{id:"1000009",score:34},{id:"1000002",score:45},{id:"1000007",score:23}];
    UIV.sort((a,b)=>{return b.score-a.score})
    console.log(UIV);
    const UIV_len = UIV.length;
    const PSUIV = Math.floor(Math.random() * 100) + 1; // Probability Segment on UIV

    // segments range -> [40%,45%,15%]
    let findRecommendationFromIndex;
    if (PSUIV <= 60) {
        findRecommendationFromIndex = Math.floor(Math.floor(Math.random() * (UIV_len*0.4)));
        console.log(findRecommendationFromIndex,"1st");
    } else if (PSUIV <= 92) {
        findRecommendationFromIndex = Math.floor(Math.floor(Math.random() * (UIV_len*0.45)) + (UIV_len*0.4));
        console.log(findRecommendationFromIndex,"2nd");
    } else {
        findRecommendationFromIndex = Math.floor(Math.floor(Math.random() * (UIV_len*0.15)) + (UIV_len*0.85));
        console.log(findRecommendationFromIndex,"3rd");
    }
    console.log(UIV[findRecommendationFromIndex].id); 
    const similarItems = await recommender.getSimilarDocuments(UIV[findRecommendationFromIndex].id);
    console.log(similarItems);
    const si = shuffle(similarItems.slice(0,2*noOfItems)).slice(0,noOfItems).map(({id})=>{return id});
    return shuffle(getFullFilledData(si,key?products:videos,noOfItems));
  } else {
    // shop
    console.log(probabilityOfChoosingShop,"shop");
    if (!key) {
        videos = await getVideoDataSet();
        products = await getProductDataSet();
        await recommender.trainBidirectional(products, videos);
    } else {
        products = await getProductDataSet();
        await recommender.train(products);
    }
    // access Product interaction from db
    // User Interaction on Products from DB
    const UIP = [{id:"6",score:82},{id:"2",score:34},{id:"4",score:45}];
    UIP.sort((a,b)=>{return b.score-a.score});
    console.log(UIP);
    const UIP_len = UIP.length;
    const PSUIP = Math.floor(Math.random() * 100) + 1; //Probability Segment on UIP

    // segments range -> [40%,45%,15%]
    let findRecommendationFromIndex;
    if (PSUIP <= 60) {
        findRecommendationFromIndex = Math.floor(Math.floor(Math.random() * (UIP_len*0.4)));
        console.log(findRecommendationFromIndex,"1st");
    } else if (PSUIP <= 92) {
        findRecommendationFromIndex = Math.floor(Math.floor(Math.random() * (UIP_len*0.45)) + (UIP_len*0.4));
        console.log(findRecommendationFromIndex,"2nd");
    } else {
        findRecommendationFromIndex = Math.floor(Math.floor(Math.random() * (UIP_len*0.15)) + (UIP_len*0.85));
        console.log(findRecommendationFromIndex,"3rd");
    }
    console.log(UIP[findRecommendationFromIndex].id);
    const similarItems = await recommender.getSimilarDocuments(UIP[findRecommendationFromIndex].id);
    console.log(similarItems);
    const si = shuffle(similarItems.slice(0,2*noOfItems)).slice(0,noOfItems).map(({id})=>{return id});
    return shuffle(getFullFilledData(si,key?products:videos,noOfItems));
  }
}

/*
// -> CF -> 80-20 (user create karne hai!!)
-> db se uip uiv nikal
-> tags store karwane hai upload karte hue -> video + product
-> uip and uiv ka score calculate karna hai
*/

function getFullFilledData(data,ds,noOfItems){
  let set = new Set(data);
  let ind = 0;
  while(ind<ds.length && set.size<noOfItems){
    set.add(ds[ind].id);
    ind++;
  }
  return [...set];
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


async function getRelatedProductsForPid(id){
    const recommender = new ContentBasedRecommender();

    products = await getProductDataSet();
    await recommender.train(products);
    const similarItems = await recommender.getSimilarDocuments(id);
    const res = similarItems.map(({id})=>id);
    return res;
}

async function getRelatedToProduct(noOfItems){
    const UIP = [{id:"6",score:82},{id:"2",score:34},{id:"4",score:45}];
    UIP.sort((a,b)=>{return b.score-a.score});
    const RUIP = UIP.slice(0,noOfItems);
    
    const res = await Promise.all(RUIP.map(async ({id})=>{
      const relatedProdutcs = await getRelatedProductsForPid(id);
      return {id,relatedProdutcs};
    }))
    return res;
}

async function getSearchedProducts(query){
    products = await getProductDataSet();
  const productsDocs = products.map(({id,content})=>content);
  const searchedProducts = await getRelatedProductsFromQuery(query, productsDocs);
  // console.log(searchedProducts);
  let res = [];
  searchedProducts.forEach(({index,similarityIndex})=>{
    if(similarityIndex>0)res.push(products[index].id);
  });
  return res;
}

async function getSearchedvideos(query){
    videos = await getVideoDataSet();
    const videosDocs = videos.map(({id,content})=>content);
    const searchedvideos = await getRelatedvideosFromQuery(query, videosDocs);
    // console.log(searchedvideos);
    let res = [];
    searchedvideos.forEach(({index,similarityIndex})=>{
    if(similarityIndex>0)res.push(videos[index].id);
  });
  return res;
}
async function getRelatedProductsFromQuery(query,products){
  const corpus = await tf_idf.createCorpusFromStringArray(products);

  const search_result = await tf_idf.rankDocumentsByQuery(query)
  // console.log(search_result);
  return search_result;
}
async function getRelatedvideosFromQuery(query,videos){
  const corpus = await tf_idf.createCorpusFromStringArray(videos);

  const search_result = await tf_idf.rankDocumentsByQuery(query)
  // console.log(search_result);
  return search_result;
}


async function getRecommendedItems(){
  // const res =await  recommendItems(1,8);
  // const res =await getSearchedProducts("");
  // const res = await getRelatedProductsForPid("1000006");
  const res = await getRelatedToProduct(5);
  console.log(res);
}
getRecommendedItems();

// videos -> content = title + tags + productsTags
// products -> content = title + desc + tags
// UIP -> score = 10*noOfClicks + cartAdded(100) + searchSimilarityIndex*10
// uiv -> score = like(150) + ((watchtime/duration)*100) + searchSimilarityIndex*10

module.exports = {recommendItems, getSearchedProducts, getRelatedToProduct, getSearchedvideos, getRelatedProductsForPid};