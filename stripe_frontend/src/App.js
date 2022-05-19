import "./App.css";
import StripeCheckout from "react-stripe-checkout";
import { useState } from "react";
import axios from "axios";

function App() {
  const [product, setproduct] = useState({
    name: "Laptop",
    price: 500,
    productBy: "HP pvt ltd.",
  });

  const makePayment = async (token) => {
    let body = {
      token,
      product,
    };
    let response = await axios.post(`http://localhost:8282/payment`, body);
    console.log("res", response);
    return response;
  };
  return (
    <div className="container">
      <div className="card" style={{ width: "20rem" }}>
        <div className="card-image">
          <img
            src="https://th.bing.com/th/id/OIP.k7o05OIR6jMBnnwR2oNlQwHaFc?pid=ImgDet&rs=1"
            width={250}
            height={250}
            alt="image"
          />
        </div>
        <div className="card-content">
          hey! buy this great Laptop just <b>{product.price}$</b>
        </div>
        <div className="card-action">
          <StripeCheckout
            stripeKey={process.env.REACT_APP_KEY}
            token={makePayment}
            name="HP Laptop"
            currency="usd"
            amount={product.price * 100}
          >
            <button className="btn  mx-3" style={{ marginLeft: "35px" }}>
              {" "}
              Buy this product
            </button>
          </StripeCheckout>
        </div>
      </div>
    </div>
  );
}

export default App;
