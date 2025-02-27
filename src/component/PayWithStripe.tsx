import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
//import Stripe from 'stripe'
import { Stripe, loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QrX2MHD4FaXC6zs0jpat0zVjYDP2O0bKuPpkHhGNoJnUpGZOHP08PML59EVvrFshO1e4YdBmoe4PSALvybAAJd7001ORP3BbI');

const StripeButton: React.FC = () => {
    //const [stripe, setStripe] = useState<Stripe | null>(null);

    const handleClick = async () => {
        const stripe = await stripePromise;
         // Call your backend to create the Checkout session.
    //const { sessionId } = await fetchCheckoutSession();
        
        try{
            if(!stripePromise){
                console.log("Empty Stripe promise");                             
                return;
            }
            
            if(stripe){
            const {error} = await stripe.redirectToCheckout({
                lineItems: [
                  { price: 'price_1QrqFyHD4FaXC6zsHMOzCyjy',
                    quantity: 1,
                   }, // Replace with your product ID
                ],
                mode: 'payment',
                successUrl: 'https://example.com/success', 
                cancelUrl: 'https://clicker-ts.vercel.app' 
              });
              console.log(error);
            }
        

        }catch(error){
            console.log(error);
        }
        
    }

   
    


  return (
    <div>
      <button className=" text-white px-4 py-2 rounded  bg-green-400"
          onClick={handleClick}      > Buy</button>
    
    
    
    </div>

);
 
}

export default StripeButton;