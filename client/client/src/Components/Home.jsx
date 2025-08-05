import { useState } from "react";

const Home = () => {

    const [isMenuOpen , setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(p => !p);
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
                        <h1>cart</h1>
                        <button className="hidden md:flex">Sign In</button>
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
                            <li><a href="#" className="font-bold text-xl text-indigo-950">Sign In</a></li>
                        </ul>
                    </div>
                    :
                    null
                }
            </nav>
        </>
    );
}

export default Home