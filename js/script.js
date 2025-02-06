(async function(){
    "use strict"
    const $ = {};
    let categories;
    const theUrl = "/data/data.json";
    $.cart = {};
    
      document.addEventListener('DOMContentLoaded', function() {
        $.toggleModal = new bootstrap.Modal("#addToCartModal");
        $.toggleCart = new bootstrap.Offcanvas("#cart")
        $.loader("#categories");
        $.loader("#category-items")
        $.getData(theUrl);

        document.querySelector("#continue-button").addEventListener("click", evt=>{
          $.toggleCart.toggle();
        })
        document.querySelector("#nav-toggeler").addEventListener("click",evt=>{
          document.querySelector("body").style.overflow = "auto"
        })
        document.querySelector("#back-to-top").addEventListener("click", evt=>{
          window.scrollTo({
            top: 0, 
            left: 0,
            behavior: 'smooth'
          });

        });
  

      });
      $.buildCart = function(){
        let html = ""
        for(let item in $.cart){
          html += `
    <div class="cart-item row shadow m-auto mb-2 rounded" id="cart-${item}">
      <div class="img-container-cart col-3"><div class="img-cart" style="background-image: url('${$.cart[item].img}');"></div></div>
      <div class="col text-start item-details p-0 m-0">
        <h3 class="ms-2 name">${$.cart[item].name}</h3>
         <p class="ms-2"><span id="cart-quantity-${item}">${$.cart[item].quantity}</span> x $<span>${$.cart[item].price}</span></p>

         <div class="col-12 mt-2">
          <div class="container">
            <div class="row">
              <button  class="quantity-btn col-4 subtract-quantity-cart" itemId="${item}"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-dash-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
              </svg></button>
              <button class=" quantity-btn col-4 add-quantity-cart" itemId="${item}"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg></button>
              <button class="quantity-btn col-4 remove-item" itemId="${item}">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
              </button>
            </div>
          </div>
         
        </div>
      </div>
    </div>
          `
        }

        html += `    
      <div class="cart-item d-flex shadow-sm m-auto rounded justify-content-start align-items-center" id="subtotal-container">
        <h3 class="ms-4">Subtotal: $<span id="subtotal-cart">${$.calculateSubTotal()}</span></h3>
      </div>
    </div>`;

        document.querySelector('#cart-body').innerHTML = html;
        
      }
      $.calculateSubTotal = function(){
        let subTotal = 0;
        for(let item in $.cart){
          subTotal += (parseFloat($.cart[item].quantity)  * parseFloat($.cart[item].price));
        }
        return subTotal.toFixed(2);
      }
      $.cartFunction =  async function(){
        document.querySelectorAll(".accordion-main").forEach(element =>{
          element.addEventListener("click", evt =>{
            const name = element.getAttribute("name");
            const price = element.getAttribute("price");
            const img = element.getAttribute("imgUrl");
            const id = element.getAttribute("id");
            $.showAddToCart(name, price, img, id);
            

          })
        
        });
        document.querySelectorAll(".cart-button").forEach(element =>{
          element.addEventListener("click", evt =>{
            $.emptyCart();
            
            $.toggleCart.toggle();
            document.querySelector("body").style.overflow = "auto"

          })
        })
        $.emptyCart = function(){
          if(Object.keys($.cart).length === 0){
            document.querySelector("#cart-body").innerHTML = `
            <p>Your Cart is Empty!!</p>
            `;
          }
          
        }
        $.AddSubtract("#add-quantity-dialog","#subtract-quantity-dialog", "#quantity");
        document.querySelector("#formSubmit").addEventListener("click", function(evt){

          let item = {

            [document.querySelector("#image-dialog").getAttribute("itemId")]: 
             {
              quantity: document.querySelector("form").elements["quantity"].value,
              price: document.querySelector("#item-price-dialog").innerText,
              name: document.querySelector("#item-name").innerText,
              img: document.querySelector("#image-dialog").getAttribute("imgUrl")
            }
          }
          $.addToCart(item);
        })
      }
      $.showAddToCart = function(name, price, img, id){
       
        document.querySelector("#item-name").innerText = name;
        document.querySelector("#item-price-dialog").innerText = price;
        document.querySelector("#image-dialog").style.backgroundImage = `url("${img}")`;
        document.querySelector("#image-dialog").setAttribute("imgUrl",img );
        document.querySelector("#image-dialog").setAttribute("itemId", id);
        document.querySelector("#quantity").value = 1;
        $.toggleModal.toggle();
        document.querySelector("body").style.overflow = "auto";
        
      }
      $.addToCart = function(item){
        let keys = Object.keys(item);
        if($.cart[keys[0]]){
          $.cart[keys].quantity = parseInt(item[keys].quantity) + parseInt($.cart[keys].quantity)  ;
        }
        else{
          $.cart[keys] = {}
          for(let j in item[keys]){
            $.cart[keys][j] = item[keys][j];
          }
        }

      document.body.focus();
      setTimeout(() => {
        $.toggleModal.toggle();
        
      }, 200);
      $.buildCart();
      $.runCartButton();

    }




      $.buildCategoriesNav = async function(data){
        let theData = await data

        return new Promise((resolve, reject) => {
          let nav = '<a  class="category-item shadow p-4 activee align-items-center d-flex justify-content-center"href="#category-items">All Categories</a>';
          for(let category in theData){
            nav += `
            <a class="category-item shadow p-4 align-items-center d-flex justify-content-center" href="#h-${category}">${data[category].name}</a>`
          }
          setTimeout(() => {
            document.querySelector("#category-items").innerHTML = nav;
  
          }, 100);
          setTimeout(() => {
            resolve();
          }, 100); 
        });


      }
      $.buildCategory = function(categoryData, id){
        let html = `          
        <div class="accordion-item shadow mb-3" id="${id}">
              <h2 id="h-${id}" class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}-control" aria-expanded="true" aria-controls="flushCollapseFirst">
                  ${categoryData.name}
                </button>
              </h2>
              <div id="${id}-control" class="accordion-collapse collapse show" aria-labelledby="a1" data-bs-parent="#flushAccordionRobots">
                <div class="accordion-body container row justify-content-around g-3 p-4">`

        for(let item of categoryData.items){
          html += `
               <div class="row shadow-sm mb-4 p-0 col-sm-6 col-md-4 col-lg-3 justify-content-center accordion-main" price=${item.Price} id="${item.id}" name="${item.Name}" imgUrl="${item.img}">
                    <div class="col-4 col-sm-12 img-container mb-2"><div class="img" style="background-image: url('${item.img}');"></div></div>
                    <div class="col-7 col-sm-12 text-start item-details p-0 m-0">
                      <h3 class="ms-2 name">${item.Name}</h3>
                       <p class="ms-2">${item.ingridians}</p>
                      </div>
                    <div class="col col-sm-12 mt-auto item-price text-center mb-2 ">$${item.Price}</div>
                  </div>
          `
        }
        html +=`</div></div></div>`;
        return html;

      }


      $.runCartButton = function(){
        const removeButton = document.querySelectorAll(".remove-item");
        const addButton = document.querySelectorAll(".add-quantity-cart");
        const subtractButton = document.querySelectorAll(".subtract-quantity-cart");
        removeButton.forEach(element => {
          element.addEventListener("click", evt=>{
            let itemId = element.getAttribute("itemId");
            delete  $.cart[itemId];
            
            setTimeout(() => {
              document.querySelector(`#cart-${itemId}`).remove();
              document.querySelector("#subtotal-cart").innerText = $.calculateSubTotal();
              $.emptyCart();
            }, 500);
            
          })
        });
        addButton.forEach(element => {
          element.addEventListener("click", evt =>{
            let itemId = element.getAttribute("itemId");
            $.cart[itemId].quantity++;
            setTimeout(() => {
              document.querySelector(`#cart-quantity-${itemId}`).innerText = $.cart[itemId].quantity;
              document.querySelector("#subtotal-cart").innerText = $.calculateSubTotal();
            }, 100);
            $.emptyCart();
          })
        })

        subtractButton.forEach(element =>{
          element.addEventListener("click", evt =>{
            let itemId = element.getAttribute("itemId");
            if($.cart[itemId].quantity > 1){
              $.cart[itemId].quantity--;
              setTimeout(() => {
                document.querySelector(`#cart-quantity-${itemId}`).innerText = $.cart[itemId].quantity;
                document.querySelector("#subtotal-cart").innerText = $.calculateSubTotal();
                console.log($.cart);
              }, 100);
            }
            else{
              delete  $.cart[itemId];
              document.querySelector(`#cart-quantity-${itemId}`).innerText = 0;

              setTimeout(() => {
                document.querySelector(`#cart-${itemId}`).remove();
  
              }, 500);
            }
            $.emptyCart();
          });
        })
      }

      $.buildCategories = async function(categories) {
        let theCategories = await categories;

        return new Promise((resolve, reject) => {
          
          let html = "";
          for(let category in theCategories){
            html +=  $.buildCategory(theCategories[category], category);
          }
          setTimeout(() => {
            document.querySelector("#categories").innerHTML = html;
          }, 100);
          
          setTimeout(() => {
            resolve();
          }, 100); 
        });
      }

     $.loader = function (element){
        document.querySelector(element).innerHTML = '<div class="loader"></div>'
      }
      $.AddSubtract = function(addButton, subButton, element){
        document.querySelector(subButton).addEventListener("click", evt =>{
          const inputElement = document.querySelector(element);
          let quantity = inputElement.value;
          if(quantity > 1){
            quantity--;
            inputElement.value = quantity;

          }
        })
        document.querySelector(addButton).addEventListener("click", evt =>{
          const inputElement = document.querySelector(element);
          let quantity = inputElement.value;
          quantity++;
          inputElement.value = quantity;

        })
      }
      $.getData = async function(url){
        try{
          const dataPromis = await fetch(url);
          const data = await dataPromis.json();
          categories = await data.results.categories;
          await $.buildCategoriesNav(categories);
          await $.buildCategories(categories);
          $.cartFunction();
          $.theScrollingEffect();
          $.activeCategory();
        }
        catch(error){
          console.log(error)
        }
      }
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header').classList;
        const backToTop = document.querySelector("#back-to-top");
        if (window.scrollY > 10) {
            backToTop.style.display = "block";
            setTimeout(() => {
              backToTop.classList.add("show");
              backToTop.classList.remove("hide");
            }, 0);

          

            header.add('scrolled');
            header.add('shadow');
        } else {
            backToTop.classList.add("hide")
            backToTop.classList.remove("show")
            backToTop.style.display = "none";
            header.remove('scrolled');
            header.remove('shadow');
        }
        
    });

    $.activeCategory = function(){
        const categories = document.querySelectorAll(".category-item")
        
        categories.forEach(element=>{
            element.addEventListener("click", evt =>{ //dblclick
                categories.forEach(element => {
                    element.classList.remove("activee");
                })
                element.classList.add("activee");

            });
        })
    }
      $.theScrollingEffect = function(){
        const scrollContainer = document.querySelector('#category-items');
    
        let isDown = false;
        let startX;
        let scrollLeft;
    
        scrollContainer.addEventListener('mousedown', (e) => {
          isDown = true;
          scrollContainer.classList.add('active');
          startX = e.pageX - scrollContainer.offsetLeft;
          scrollLeft = scrollContainer.scrollLeft;
        });
    
        scrollContainer.addEventListener('mouseleave', (e) => {
          isDown = false;
          scrollContainer.classList.remove('active');
        });
    
        scrollContainer.addEventListener('mouseup', (e) => {
          isDown = false;
          scrollContainer.classList.remove('active');
        });
    
        scrollContainer.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - scrollContainer.offsetLeft;
          const walk = (x - startX) * 1;
          scrollContainer.scrollLeft = scrollLeft - walk;
        });

        document.querySelector("#scroll-left").addEventListener("click", evt =>{
            document.querySelector('#category-items').scrollBy({
                left: -200,
                behavior: 'smooth'
              });
        })
        document.querySelector("#scroll-right").addEventListener("click", evt =>{
            document.querySelector('#category-items').scrollBy({
                left: 200,
                behavior: 'smooth'
              });
        })

      }
      // Object.toggle = $.toggleCart.toggle()Object
}())