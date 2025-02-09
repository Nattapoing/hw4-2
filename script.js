
const STORAGE_KEY = 'inventory';
const MIN_STOCK = 5;
function getFromLocalStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอ่านข้อมูล:", error);
        return [];
    }
}
function saveToLocalStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
    }
}
function addProduct(productData) {
    const products = getFromLocalStorage();
    const newProduct = {
        id: Date.now().toString(),
        name: productData.name,
        price: parseFloat(productData.price),
        inStock: parseInt(productData.inStock),
        category: productData.category,
        minStock: MIN_STOCK,
        totalSales: 0
    };
    products.push(newProduct);
    saveToLocalStorage(products);
    updateDisplay();
}
function updateStock(productId) {
    const products = getFromLocalStorage();
    const product = products.find(p => p.id === productId);
    
    if (product && product.inStock > 0) {
        product.inStock -= 1;
        product.totalSales += 1;
        saveToLocalStorage(products);
        updateDisplay();
    } else {
        alert('สินค้าหมด!');
    }
}
function checkLowStock() {
    const products = getFromLocalStorage();
    return products.filter(product => product.inStock < MIN_STOCK);
}
function generateSalesReport() {
    const products = getFromLocalStorage();
    return products
        .filter(product => product.totalSales > 0)
        .sort((a, b) => b.totalSales - a.totalSales);
}
function updateDisplay() {
    displayProducts();
    displayLowStock();
    displaySalesReport();
}
function displayProducts() {
    const productList = document.getElementById('productList');
    const products = getFromLocalStorage();
    
    productList.innerHTML = products.map(product => `
        <div class="product-item">
            <h3>${product.name}</h3>
            <p>ราคา: ${product.price} บาท</p>
            <p>คงเหลือ: ${product.inStock} ชิ้น</p>
            <p>ประเภท: ${product.category}</p>
            <p>ยอดขายทั้งหมด: ${product.totalSales} ชิ้น</p>
            <button class="sell-button" onclick="updateStock('${product.id}')">ขายสินค้า</button>
        </div>
    `).join('');
}
function displayLowStock() {
    const lowStockList = document.getElementById('lowStockList');
    const lowStockProducts = checkLowStock();
    
    lowStockList.innerHTML = lowStockProducts.map(product => `
        <div class="product-item low-stock">
            <h3>${product.name}</h3>
            <p>คงเหลือ: ${product.inStock} ชิ้น</p>
        </div>
    `).join('');
}
function displaySalesReport() {
    const salesReport = document.getElementById('salesReport');
    const topSellers = generateSalesReport();
    
    salesReport.innerHTML = topSellers.map(product => `
        <div class="product-item">
            <h3>${product.name}</h3>
            <p>ยอดขายทั้งหมด: ${product.totalSales} ชิ้น</p>
        </div>
    `).join('');
}
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        inStock: document.getElementById('inStock').value,
        category: document.getElementById('category').value
    };
    
    addProduct(productData);
    this.reset();
});
updateDisplay();