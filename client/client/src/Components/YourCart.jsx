import { useState, useEffect, useContext, use } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { handleLogout } from "../utils/HandleLogout";

const YourCart = () => {
    const [carts, setCarts] = useState([]);
    const {auth , setAuth} = useContext(AuthContext);
    const [inputValues , setInputValues] = useState({});
    const [initialValues , setInitialValues] = useState({});
    const [totalPrice , setTotalPrice] = useState(0);
    const [isMenuOpen , setIsMenuOpen] = useState(false);
    
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`/fetchcart?user_id=${auth.user_id}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            const updatedCart = response.data.updatedCart;
            setCarts(updatedCart);

            const values = {}
            let price = 0;
            updatedCart.map(cart => {
                values[cart.cart_item_id] = cart.quantity;
                price += parseFloat(cart.price) * parseInt(cart.quantity);
            })
            price = price.toFixed(2);

            setInputValues(values);
            setInitialValues(values);
            setTotalPrice(price);

        } catch (err) {
            console.error(err);
        }
        };

    fetchCart();  
    }, []);

    const handleSetitem = async (user_id , product_id , quantity , cart_item_id , price) => {
        if (initialValues[cart_item_id] === quantity) {
            return;
        }
        try {
            const response = await axios.post(
                '/setcart',
                { 
                    "user_id" : user_id ,
                    "product_id" : product_id,
                    "quantity": parseInt(quantity)
                },
                    
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
                );
            const updatedCart = response.data.updatedCart;
            setCarts(updatedCart);
            setInitialValues(prev => ({ ...prev, [cart_item_id]: quantity }));
            const newTotalPrice = updatedCart.reduce((sum , item) => {
                return sum + (parseFloat(item.price) * parseInt(item.quantity));
            } , 0)
            setTotalPrice(newTotalPrice.toFixed(2));
        }
        catch (err) {
            console.error(err);
        }

    };

    const handleInputChange = (cart_id , quantity) => {
        setInputValues(prev => ({ ...prev , [cart_id]: quantity}));
    };

    const logoutHandler = async () => {
            await handleLogout(setAuth);
    }

    const toggleMenu = () => {
        setIsMenuOpen(p => !p);
    }

  return (
    <>
        <main>
            <nav className="bg-white p-4 shadow-lg">
                <div className="flex items-center justify-between md:mx-60">
                    <div className="flex justify-between w-md">
                        <span>
                            <h1 className="font-bold text-xl text-indigo-950">LUGX</h1>
                        </span>
                        <ul className="hidden md:flex space-x-8 items-center">
                            <li><a href="#" className="font-bold text-xl text-indigo-950">Home</a></li>
                            <li><a href="#" className="font-bold text-xl text-indigo-950">Shop</a></li>
                            <li><a href="#" className="font-bold text-xl text-indigo-950">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="flex justify-between gap-6 items-center">
                        
                        {auth?.accessToken && <h1>My Account</h1>}

                        {auth?.accessToken ? 
                            <button className="hidden md:flex hover:cursor-pointer" onClick={logoutHandler}>Sign Out</button>
                            :
                            <Link to="/login"><button className="hidden md:flex hover:cursor-pointer">Sign In</button></Link>
                        }
                        
                        
                        {/* Menu button */}
                        <div className="md:hidden">
                            <button id='menu-toggle' className="text-indigo-950" onClick={toggleMenu}>
                                {
                                    isMenuOpen ? 
                                        <svg viewBox="0 0 10 10" className='w-8 h-8' 
                                            stroke="currentColor" 
                                            stroke-width="1"
                                            >
                                                <line x1="1" y1="1" x2="8" y2="8" />
                                                <line x1="8" y1="1" x2="1" y2="8" />
                                        </svg>
                                                :
                                        <svg
                                            fill='none'
                                            stroke='currentColor'
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            className='w-8 h-8'
                                        >
                                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                                        </svg>
                                } 
                            </button>
                        </div>
                    </div>                 
                </div>
                
                { isMenuOpen ? 
                    <div>
                        <ul className="md:hidden flex flex-col items-center gap-3">
                            <li><a href="#" className="font-bold text-xl text-indigo-950">Home</a></li>
                            <li><a href="#" className="font-bold text-xl text-indigo-950">Shop</a></li>
                            <li><a href="#" className="font-bold text-xl text-indigo-950">Contact Us</a></li>
                            { auth?.accessToken ? (
                                <>
                                    <li><a href="#" className="font-bold text-xl text-indigo-950">My Account</a></li>
                                    <li><a href="#" onClick={logoutHandler} className="font-bold text-xl text-indigo-950">Sign Out</a></li>
                                </>
                            )   : (
                                <Link to="/login">
                                    <li><h2 className="font-bold text-xl text-indigo-950">Sign In</h2></li>
                                </Link>
                            )}
                        </ul>
                    </div>
                    :
                    null
                }
            </nav>
            <section>
                <h1>Your Cart</h1>
                <ul>
                    {carts.map((cart) => 
                        <li key={cart.cart_item_id}>
                            <h2>{cart.name}</h2>
                            <h2>${cart.price}</h2>
                            <h2>Total: ${inputValues[cart.cart_item_id] * cart.price}</h2>
                            <button 
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 cursor-pointer disabled:bg-gray-400"
                                onClick={() => {
                                    const newQuantity = inputValues[cart.cart_item_id] - 1;
                                    handleInputChange(cart.cart_item_id , newQuantity);
                                    handleSetitem(auth.user_id , cart.product_id , newQuantity , cart.cart_item_id , cart.price);
                                }}
                                >
                                    -
                            </button>
                            <input 
                                className="px-2 py-2 w-14"
                                type="text"
                                value={inputValues[cart.cart_item_id] || ""}
                                min="0" 
                                onChange={(e) => handleInputChange(cart.cart_item_id , e.target.value)}
                                onBlur={() => handleSetitem(auth.user_id , cart.product_id , inputValues[cart.cart_item_id] , cart.cart_item_id, cart.price)}
                            />
                            <button 
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer disabled:bg-gray-400"
                                onClick={() => {
                                    const newQuantity = inputValues[cart.cart_item_id] + 1;
                                    handleInputChange(cart.cart_item_id , newQuantity);
                                    handleSetitem(auth.user_id , cart.product_id , newQuantity , cart.cart_item_id , cart.price);
                                }}
                            >+
                            </button>
                        </li>
                    )}
                    Total prices: ${totalPrice}
                </ul>
            </section>
        </main>
    </>
  );
};

export default YourCart;
