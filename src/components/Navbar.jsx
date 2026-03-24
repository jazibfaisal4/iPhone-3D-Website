import { appleImg, bagImg, searchImg } from '../utils'
import { navLists } from '../constants'
import { useState } from 'react'

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center relative z-50">
            <nav className="flex w-full screen-max-width items-center">
                <div className="flex items-center gap-4">
                    <img src={appleImg} alt="Apple" width={14} height={18} />

                    {/* Mobile burger */}
                    <button
                        type="button"
                        aria-label="Open navigation menu"
                        className="sm:hidden p-2 rounded-full hover:bg-white/5 transition"
                        onClick={() => setMenuOpen((v) => !v)}
                    >
                        <span className="block w-5 h-0.5 bg-white mb-1"></span>
                        <span className="block w-5 h-0.5 bg-white mb-1"></span>
                        <span className="block w-5 h-0.5 bg-white"></span>
                    </button>
                </div>

                {/* Desktop links */}
                <div className="flex flex-1 justify-center max-sm:hidden">
                    {navLists.map((nav) => (
                        <div
                            key={nav}
                            className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all"
                        >
                            {nav}
                        </div>
                    ))}
                </div>

                <div className="flex items-baseline gap-7 ml-auto">
                    <img src={searchImg} alt="Search" width={18} height={18} />
                    <img src={bagImg} alt="Bag" width={18} height={18} />
                </div>
            </nav>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="sm:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm">
                    <div className="absolute top-0 left-0 right-0 p-5">
                        <div className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden">
                            <div className="flex items-center justify-between p-4">
                                <span className="text-sm text-gray">Menu</span>
                                <button
                                    type="button"
                                    aria-label="Close navigation menu"
                                    className="p-2 rounded-full hover:bg-white/5 transition"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <span className="block w-5 h-0.5 bg-white rotate-45 translate-y-1.5" />
                                    <span className="block w-5 h-0.5 bg-white -rotate-45 -translate-y-0.5" />
                                </button>
                            </div>

                            <div className="flex flex-col p-4 gap-2">
                                {navLists.map((nav) => (
                                    <button
                                        key={nav}
                                        type="button"
                                        className="text-left px-4 py-3 rounded-2xl text-sm text-gray hover:text-white hover:bg-white/5 transition"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {nav}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar