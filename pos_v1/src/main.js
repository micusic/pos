library = loadAllItems();
promotions = loadPromotions();
sumTotalPrice = 0;
sumActualPrice = 0;
//console.log(library);

function getUnit(barcode) {
    for (var i = 0; i < library.length; i++) {
        if(library[i]["barcode"] === barcode){
            return library[i]["unit"];
        }
    }
}

function getName(barcode) {
    for (var i = 0; i < library.length; i++) {
        if(library[i]["barcode"] === barcode){
            return library[i]["name"];
        }
    }
}
function getPrice(barcode) {
    for (var i = 0; i < library.length; i++) {
        if(library[i]["barcode"] === barcode){
            return library[i]["price"];
        }
    }
}
function getBarcodeAndQuantity(item) {
    var pattern = /(ITEM\d{6})-?(\d)?/;
    var result = pattern.exec(item);
    var barcode = result[1];
    var quantity = (result[2] === undefined ? 1 : result[2]);
    return {barcode: barcode, quantity: quantity};
}

function calcPromPrice(quantity, unitPrice, type) {
    var promPrice = 0;
    if('BUY_TWO_GET_ONE_FREE' === type){
        promPrice = unitPrice * Math.floor(quantity/3);
    }
    return promPrice;
}
function getSumPrice(quantity, barcode) {
    var sumPrice = quantity * getPrice(barcode);
    sumTotalPrice += sumPrice;
    for (var i = 0; i < promotions.length; i++){
        if(promotions[i].barcodes.indexOf(barcode) !== -1 ){
            sumPrice -= calcPromPrice(quantity, getPrice(barcode), promotions[i].type);
        }
    }
    sumActualPrice += sumPrice;
    return  sumPrice;
}

function getSummary(barcode, quantity) {
    return "名称：" + getName(barcode) +
        "，数量：" + quantity +
        "" + getUnit(barcode) +
        "，单价：" + getPrice(barcode).toFixed(2) +
        "(元)，小计：" + getSumPrice(quantity, barcode).toFixed(2) +
        "(元)\n";
}

function getPromNumber(barcode, quantity) {
    for (var i = 0; i < promotions.length; i++){
        if(promotions[i].barcodes.indexOf(barcode) !== -1 ){
            if('BUY_TWO_GET_ONE_FREE' === promotions[i].type){
                return Math.floor(quantity/3);
            }
        }
    }
    return 0;
}
function getPromotionSummary(barcode, quantity) {
    var promNumber = getPromNumber(barcode, quantity);
    return promNumber === 0 ? "" :
        "名称：" + getName(barcode) +
        "，数量：" + promNumber +
        "" + getUnit(barcode) +
        "\n";
}
function printInventory (items) {
    var summary = "";
    var promotionSummary = "";
    var puchasedBarcodes = {};

    for (var i = 0; i < items.length; i++) {
        var __ret = getBarcodeAndQuantity(items[i]);
        var barcode = __ret.barcode;
        var quantity = __ret.quantity;
        if(puchasedBarcodes[barcode]){
            puchasedBarcodes[barcode]+=1;
        }else{
            puchasedBarcodes[barcode]=quantity;
        }
    }

    for(var barcode in puchasedBarcodes){
        summary += getSummary(barcode, puchasedBarcodes[barcode]);
        promotionSummary += getPromotionSummary(barcode, puchasedBarcodes[barcode]);
    }


    var text =
            '***<没钱赚商店>购物清单***\n' +
            summary +
            '----------------------\n' +
            '挥泪赠送商品：\n' +
            promotionSummary +
            '----------------------\n' +
            '总计：' +
            sumActualPrice.toFixed(2) + '(元)\n' +
            '节省：' +
            (sumTotalPrice - sumActualPrice).toFixed(2) + '(元)\n' +
            '**********************';
	console.log(text);
}