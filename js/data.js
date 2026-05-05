// Purpose: menu catalog data. Callers: menu/cart/page modules. Deps: none. API: menu, bestSellerIds. Side effects: globals.
const menu = [
  { id:1,  name:"Kopi Espresso",  img:"espresso.jpeg",  price:22000, cat:"hot",   desc:"Double shot espresso, crema sempurna & aroma kuat" },
  { id:2,  name:"Americano",      img:"americano.jpeg",          price:25000, cat:"hot",   desc:"Espresso panas + air panas, ringan & bold" },
  { id:3,  name:"Latte",          img:"1 latte.jpeg",          price:32000, cat:"hot",   desc:"Espresso lembut dengan steamed milk creamy" },
  { id:4,  name:"Cappuccino",     img:"4 capuccino.jpeg",         price:32000, cat:"hot",   desc:"Espresso + foam susu tebal, klasik & nikmat" },
  { id:5,  name:"Es Kopi Susu",   img:"2 es kopi susu.jpeg",        price:30000, cat:"cold",  desc:"Kopi hitam + susu segar + gula aren" },
  { id:6,  name:"Cold Brew",      img:"3 cold brew.jpeg",        price:34000, cat:"cold",  desc:"Seduh dingin 12 jam, smooth & refreshing" },
  { id:7,  name:"Iced Matcha",    img:"iced matcha.jpeg",        price:30000, cat:"cold",  desc:"Matcha premium + oat milk, segar & harum" },
  { id:8,  name:"Es Flores",      img:"es flores.jpeg",        price:32000, cat:"cold",  desc:"Rasa yang lembut + manis" },
  { id:9,  name:"Croissant",      img:"5 crossiant.jpeg",         price:22000, cat:"snack", desc:"Renyah di luar, lembut di dalam" },
  { id:10, name:"Banana Cake",    img:"banana cake.jpeg",         price:25000, cat:"snack", desc:"Homemade, pisang asli tanpa pengawet" },
  { id:11, name:"Choco Cookie",   img:"cookie.jpeg",         price:18000, cat:"snack", desc:"Cokelat Belgian, crispy & chewy" },
  { id:12, name:"Roti Bakar",     img:"roti bakar.jpeg",         price:20000, cat:"snack", desc:"Gandum + selai kacang + madu lokal" },
];

const bestSellerIds = [3, 5, 6, 4, 9, 10];
