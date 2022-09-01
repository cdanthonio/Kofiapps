
Vue.component('product-reviews',{
    template:`
    <form class="review-form" @submit.prevent="onSubmit">

       <p v-if="errors.length">
       <b>Please correct the following error(s)</b>
       <ul>
       <li v-for="error in errors">{{error}}</li>
       </ul>
       </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>`,
    
    data(){
        return{
            name: null,
            rating: null,
            review: null,
            errors:[]
        }
    },
    methods:{
        onSubmit(){
            if(this.name && this.rating && this.review){
            let productReview={
                name: this.name,
                review: this.review,
                rating: this.rating
            }
        

            this.$emit('review-submitted',productReview)
            this.name = null,
            this.review = null,
            this.rating = null,
            this.errors= []
        }
        else{
            if(!this.name) this.errors.push("Name Required")
            if(!this.review) this.errors.push("Review Required")
            if(!this.rating) this.errors.push("Rating Required")
        
        }
        }
    }


    
})

Vue.component('product-details',{
    props:{
        details:{
            type: Array,
            required: true
        }
    },
    template:`
    <ul>
                    <li v-for="detail in details">{{detail}}</li>
                </ul>
    `
})

Vue.component('product',{
    props:{
         premium:{
            type: Boolean,
            required: true
         }
    },

    template:`
    <div class="product">
                 <div class="product-image">
                <img v-bind:src="image">
                    </div>
    
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else :class="{outOfStock: !inStock}">Out of Stock</p>
                <p>shipping {{shipping}}</p>
                <product-details :details="details"></product-details>
                

                <div v-for="variant,index in variants" 
                    :key="variant.variantId"
                    class="color-box"
                    :style="{backgroundColor: variant.variantColor}"
                    @mouseover="updateProduct(index)">
                    </div>

                   <button v-on:click="addToCart"   :disabled="!inStock"
                                                    :class="{disabledButton: !inStock}">Add to Cart</button>
                   <!--button v-on:click="removeFromCart" class="button1">Remove from Cart</button-->

                </div>
       <div>
    <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul>
          <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
          </li>
        </ul>
       </div>
       
                <product-reviews @review-submitted="addReview"></product-reviews>
            </div>
            </div>
    `,
    data(){
        return{
            product: 'Socks',
        selectedVariant: 0,
        brand: 'Vue Mastery',
        details: ["80% Cotton","20% Polyester","Gender Neutral"],
        reviews:[],

        variants:[
            {
                variantId: 1234,
                variantColor: "green",
                variantImage: './assets/VmSocks-green-onWhite.jpg',
                variantQuantity: 10
            },
            {
                variantId: 4563,
                variantColor:"blue",
                variantImage: './assets/VmSocks-blue-onWhite.jpg',
                variantQuantity: 0
            }
        ],
        

    }},
        

    methods:{
        addToCart(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },

        updateProduct(index){
            this.selectedVariant= index
            console.log(index)
        },

        /*removeFromCart(){
            this.$emit('remove-from-cart',this.variants[this.selectedVariant].variantId)
        },
        */

        addReview(productReview){
            this.reviews.push(productReview)
        
        }

        
    },

    computed:{
        title(){
            return this.brand + ' ' +this.product
        },

        image(){
            return this.variants[this.selectedVariant].variantImage

        },

        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },

        shipping(){
            if(this.premium){
                return "free"
            }
            return 2.99
        }

    }

})

var app = new Vue({
    el: '#app',
    data:{
        premium: false,
        cart: []
    },

    methods:{
        updateCart(id){
            this.cart.push(id)
        },
        
        /*
        removeFromCart(id){
            for(var i=this.cart.length - 1; i>=0; i--){
                if(this.cart[i] === id){
                    this.cart.splice(i,1);

                }
            }
            */
        }
    
})

