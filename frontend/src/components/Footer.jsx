import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Leaf, Sprout, Copyright } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-green-900 text-white pt-16 pb-8 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 p-1.5 rounded-lg">
                                <Sprout size={20} className="text-white" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Hariyali Ghar</h2>
                        </div>
                        <p className="text-green-100/70 text-sm leading-relaxed">
                            Nepal's own online plant nursery. Bringing fresh plants and gardening joy to your doorstep.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-green-400">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-green-100/70">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/plants" className="hover:text-white transition-colors">All Plants</Link></li>
                            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-green-400">Categories</h3>
                        <ul className="space-y-3 text-sm text-green-100/70">
                            <li>
                                <Link to="/plants" state={{ filterCategory: "Indoor Plants" }} className="hover:text-white transition-colors">
                                    Indoor Plants
                                </Link>
                            </li>
                            <li>
                                <Link to="/plants" state={{ filterCategory: "Outdoor Plants" }} className="hover:text-white transition-colors">
                                    Outdoor Plants
                                </Link>
                            </li>
                            <li>
                                <Link to="/plants" state={{ filterCategory: "Seed Plants" }} className="hover:text-white transition-colors">
                                    Seeds
                                </Link>
                            </li>
                            <li>
                                <Link to="/plants" state={{ filterCategory: "Succulents Plants" }} className="hover:text-white transition-colors">
                                    Succulents
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-green-400">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-green-100/70">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-green-500 mt-0.5" />
                                <span>Sunsari, Nepal</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-green-500" />
                                <span>+977 9742869769</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-green-500" />
                                <span className="break-all">hariyalighar78@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 mt-8 flex justify-center items-center">
                    <div className="flex items-center gap-2 text-green-100/30 text-[12px] uppercase tracking-widest">
                        <Copyright size={14} strokeWidth={1.5} />
                        <p>2026 Hariyali Ghar. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;