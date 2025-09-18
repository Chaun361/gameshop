import { useState , useEffect , useContext } from "react";
import axios from '../api/axios';
import AuthContext from "../context/AuthProvider";
import { useNavigate , Link } from "react-router-dom";

import { handleLogout } from "../utils/HandleLogout";

const Home = () => {
    const [products , setProducts] = useState([]);
    const [isMenuOpen , setIsMenuOpen] = useState(false);
    const [cartQuantity , setCartQuantity] = useState(0); 
    
    const {auth , setAuth} = useContext(AuthContext);

    const navigate = useNavigate();

    useEffect( () => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products');
                const data = response.data.products;
                setProducts(data);
            }
            catch (err) {
                console.error(err);
            }
        };

        const fetchCart = async () => {
            if (!auth?.accessToken) return;

            try {
                const response = await axios.get(
                `/fetchcart?user_id=${auth.user_id}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });

                const userCart = response.data.updatedCart;
                let totalQuantity = 0;
                userCart.map(item => totalQuantity += item.quantity);
                setCartQuantity(totalQuantity);

            } catch (err) {
                console.error(err);
            }
            
        };

        fetchCart();
        fetchProducts();
        console.log(auth?.accessToken);
    } , []);

    const toggleMenu = () => {
        setIsMenuOpen(p => !p);
    }

    const handleAddCart = async (product_id) => {
        if (!auth?.accessToken) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(
                '/add',
                { 
                    "user_id" : auth.user_id ,
                    "product_id" : product_id,
                    "quantity": 1
                },
                    
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            const userCart = response.data.updatedCart;
            let totalQuantity = 0;
            userCart.map(item => totalQuantity += item.quantity);
            setCartQuantity(totalQuantity);

        } catch (err) {
            console.err(err);
        }
        
    }

    const logoutHandler = async () => {
        await handleLogout(setAuth);
    }
    
    return(
        <>
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

                        <div className="flex gap-2">
                            <Link to="/yourcart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </Link>
                            { auth?.accessToken && <span>{cartQuantity}</span>}
                        </div>
                        
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
            <main>
                <h1>Products</h1>
                <ul>
                    {products.map((product) => 
                        <li id={product.product_id} key={product.product_id}>
                            <h2>{product.name}</h2>
                            <h2>{product.price}</h2>
                            <h3>Stock: x{product.stock_quantity}</h3>
                            <button
                                onClick={() => handleAddCart(product.product_id)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                Add to cart
                            </button>
                        </li>
                    )}
                </ul>
            </main>
        </>
    );
}

export default Home