import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  ChevronRight,
  Clock,
  CheckCircle2,
  Menu as MenuIcon
} from 'lucide-react';
import { SiteConfig, MenuItem, Testimonial } from './types';
import { fetchConfig, saveConfig } from './services/configService';

export default function App() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    order: '',
    notes: ''
  });

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    if (config) {
      document.title = config.branding.brandName;
      if (config.branding.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = config.branding.faviconUrl;
      }
    }
  }, [config]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    const message = `Customer Name: ${formData.name}
Customer Phone: ${formData.phone}
Order: ${formData.order}
Time: ${currentTime}
Notes: ${formData.notes}`;

    const encodedMessage = encodeURIComponent(message).replace(/%20/g, '%20');
    const phone = "213558620107";
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const loadConfig = async () => {
    try {
      setError(null);
      const data = await fetchConfig();
      setConfig(data);
    } catch (error: any) {
      console.error("Error loading config:", error);
      setError(error.message || "Failed to connect to the server.");
    }
  };

  const scrollToContact = (orderText?: string) => {
    if (orderText) {
      setFormData(prev => ({ ...prev, order: orderText }));
    }
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      await saveConfig(config);
      setIsEditing(false);
      alert("Configuration saved successfully!");
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Failed to save configuration.");
    }
  };

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <X size={32} />
      </div>
      <h1 className="text-2xl font-black uppercase italic mb-2">Connection Error</h1>
      <p className="text-stone-500 mb-8 max-w-md">{error}</p>
      <button 
        onClick={loadConfig}
        className="bg-red-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-red-700 transition-all"
      >
        Try Again
      </button>
    </div>
  );

  if (!config) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  );

  const categories = ['All', ...new Set(config.menu.map(item => item.category))];
  const filteredMenu = activeCategory === 'All' 
    ? config.menu 
    : config.menu.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-red-100 selection:text-red-900">
      {/* Admin Toggle */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className="bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-stone-800 transition-colors"
        >
          {isAdmin ? 'Exit Admin' : 'Admin Mode'}
        </button>
        {isAdmin && (
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            {isEditing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit Content</>}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {config.branding.logoUrl ? (
                <img src={config.branding.logoUrl} alt={config.branding.brandName} className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl italic">
                  {config.branding.brandName.charAt(0)}
                </div>
              )}
              <span className="text-xl font-black tracking-tighter uppercase italic text-red-600">{config.branding.brandName}</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#menu" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Menu</a>
              <a href="#about" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">About</a>
              <a href="#promotions" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Specials</a>
              <a href="#contact" className="text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors">Contact</a>
              <a 
                href={config.hero.ctaLink}
                className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-md shadow-red-200"
              >
                Order Now
              </a>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-white p-4 md:hidden"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)}><X size={32} /></button>
            </div>
            <div className="flex flex-col items-center gap-8 mt-12">
              <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase italic">Menu</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase italic">About</a>
              <a href="#promotions" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase italic">Specials</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black uppercase italic">Contact</a>
              <a href={config.hero.ctaLink} className="bg-red-600 text-white px-12 py-4 rounded-full text-xl font-black uppercase italic shadow-xl">Order Now</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={config.hero.bgImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            {isEditing ? (
              <div className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Brand Name</label>
                    <input 
                      type="text" 
                      value={config.branding.brandName}
                      onChange={(e) => setConfig({...config, branding: {...config.branding, brandName: e.target.value}})}
                      className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Tagline</label>
                    <input 
                      type="text" 
                      value={config.branding.tagline}
                      onChange={(e) => setConfig({...config, branding: {...config.branding, tagline: e.target.value}})}
                      className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Logo URL</label>
                    <input 
                      type="text" 
                      value={config.branding.logoUrl}
                      onChange={(e) => setConfig({...config, branding: {...config.branding, logoUrl: e.target.value}})}
                      className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 block mb-1">Favicon URL</label>
                    <input 
                      type="text" 
                      value={config.branding.faviconUrl}
                      onChange={(e) => setConfig({...config, branding: {...config.branding, faviconUrl: e.target.value}})}
                      className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="h-px bg-white/20 my-2"></div>
                <textarea 
                  value={config.branding.tagline}
                  onChange={(e) => setConfig({...config, branding: {...config.branding, tagline: e.target.value}})}
                  className="w-full bg-transparent text-white text-xl font-medium border-b border-white/30 focus:outline-none h-20"
                />
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="CTA Text"
                    value={config.hero.ctaText}
                    onChange={(e) => setConfig({...config, hero: {...config.hero, ctaText: e.target.value}})}
                    className="flex-1 bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="CTA Link"
                    value={config.hero.ctaLink}
                    onChange={(e) => setConfig({...config, hero: {...config.hero, ctaLink: e.target.value}})}
                    className="flex-1 bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Background Image URL"
                  value={config.hero.bgImage}
                  onChange={(e) => setConfig({...config, hero: {...config.hero, bgImage: e.target.value}})}
                  className="w-full bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none"
                />
              </div>
            ) : (
              <>
                <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic leading-none tracking-tighter mb-6">
                  {config.branding.brandName}
                </h1>
                <p className="text-xl md:text-2xl text-stone-200 mb-10 font-medium max-w-lg">
                  {config.branding.tagline}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => scrollToContact()}
                    className="bg-red-600 text-white px-10 py-5 rounded-full text-lg font-black uppercase italic tracking-widest hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-red-600/40 flex items-center gap-3"
                  >
                    <ShoppingBag size={24} />
                    {config.hero.ctaText}
                  </button>
                  <a 
                    href="#menu"
                    className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full text-lg font-black uppercase italic tracking-widest hover:bg-white/20 transition-all"
                  >
                    View Menu
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 mb-4">Our Menu</h2>
              <p className="text-stone-500 text-lg max-w-xl">Freshly prepared, locally sourced ingredients, and the secret Mr Burger sauce that keeps you coming back.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {isEditing && (
                <button 
                  onClick={() => {
                    const newCat = prompt("Enter new category name:");
                    if (newCat) {
                      const newItem: MenuItem = {
                        id: Date.now(),
                        category: newCat,
                        name: "New Item",
                        description: "Description here",
                        price: 1000,
                        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
                      };
                      setConfig({...config, menu: [...config.menu, newItem]});
                    }
                  }}
                  className="bg-stone-900 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                >
                  <Plus size={16} /> Add Category
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredMenu.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group bg-stone-50 rounded-3xl overflow-hidden border border-stone-100 hover:shadow-2xl hover:shadow-stone-200 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-red-600">
                      {item.category}
                    </div>
                    {isEditing && (
                      <button 
                        onClick={() => setConfig({...config, menu: config.menu.filter(m => m.id !== item.id)})}
                        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input 
                          type="text" 
                          value={item.name}
                          onChange={(e) => {
                            const newMenu = config.menu.map(m => m.id === item.id ? {...m, name: e.target.value} : m);
                            setConfig({...config, menu: newMenu});
                          }}
                          className="w-full bg-white border border-stone-200 px-2 py-1 rounded font-bold"
                        />
                        <textarea 
                          value={item.description}
                          onChange={(e) => {
                            const newMenu = config.menu.map(m => m.id === item.id ? {...m, description: e.target.value} : m);
                            setConfig({...config, menu: newMenu});
                          }}
                          className="w-full bg-white border border-stone-200 px-2 py-1 rounded text-sm h-16"
                        />
                        <input 
                          type="number" 
                          value={item.price}
                          onChange={(e) => {
                            const newMenu = config.menu.map(m => m.id === item.id ? {...m, price: parseInt(e.target.value)} : m);
                            setConfig({...config, menu: newMenu});
                          }}
                          className="w-full bg-white border border-stone-200 px-2 py-1 rounded font-bold"
                        />
                        <input 
                          type="text" 
                          value={item.image}
                          onChange={(e) => {
                            const newMenu = config.menu.map(m => m.id === item.id ? {...m, image: e.target.value} : m);
                            setConfig({...config, menu: newMenu});
                          }}
                          className="w-full bg-white border border-stone-200 px-2 py-1 rounded text-xs"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-black uppercase italic tracking-tight">{item.name}</h3>
                          <span className="text-red-600 font-black text-lg">{item.price} <span className="text-[10px] uppercase">DZD</span></span>
                        </div>
                        <p className="text-stone-500 text-sm mb-6 line-clamp-2">{item.description}</p>
                        <button 
                          onClick={() => scrollToContact(`I'd like to order: ${item.name}`)}
                          className="w-full bg-stone-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition-colors group-hover:shadow-lg group-hover:shadow-red-200"
                        >
                          <MessageCircle size={16} />
                          Order Now
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
              {isEditing && (
                <button 
                  onClick={() => {
                    const newItem: MenuItem = {
                      id: Date.now(),
                      category: activeCategory === 'All' ? 'Burger' : activeCategory,
                      name: "New Item",
                      description: "Description here",
                      price: 1000,
                      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800"
                    };
                    setConfig({...config, menu: [...config.menu, newItem]});
                  }}
                  className="border-2 border-dashed border-stone-200 rounded-3xl flex flex-col items-center justify-center p-8 hover:border-red-600 hover:bg-red-50 transition-all text-stone-400 hover:text-red-600"
                >
                  <Plus size={48} />
                  <span className="font-bold uppercase tracking-widest mt-4">Add Item</span>
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      {config.promotion.show && (
        <section id="promotions" className="py-24 bg-red-600 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-red-700 -skew-x-12 translate-x-1/4 z-0"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-block bg-yellow-400 text-red-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  Limited Time Offer
                </div>
                {isEditing ? (
                  <div className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                    <input 
                      type="text" 
                      value={config.promotion.title}
                      onChange={(e) => setConfig({...config, promotion: {...config.promotion, title: e.target.value}})}
                      className="w-full bg-transparent text-white text-5xl font-black uppercase italic border-b border-white/30 focus:outline-none"
                    />
                    <textarea 
                      value={config.promotion.description}
                      onChange={(e) => setConfig({...config, promotion: {...config.promotion, description: e.target.value}})}
                      className="w-full bg-transparent text-white text-xl border-b border-white/30 focus:outline-none h-24"
                    />
                    <div className="flex gap-4">
                      <input 
                        type="date" 
                        value={config.promotion.startDate}
                        onChange={(e) => setConfig({...config, promotion: {...config.promotion, startDate: e.target.value}})}
                        className="flex-1 bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30"
                      />
                      <input 
                        type="date" 
                        value={config.promotion.endDate}
                        onChange={(e) => setConfig({...config, promotion: {...config.promotion, endDate: e.target.value}})}
                        className="flex-1 bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                      {config.promotion.title}
                    </h2>
                    <p className="text-xl text-red-50 mb-10 font-medium">
                      {config.promotion.description}
                    </p>
                    <div className="flex items-center gap-8 mb-10">
                      <div className="flex items-center gap-3 text-white">
                        <Clock className="text-yellow-400" />
                        <span className="font-bold uppercase tracking-widest text-sm">
                          Valid: {config.promotion.startDate} - {config.promotion.endDate}
                        </span>
                      </div>
                    </div>
                    <a 
                      href={config.promotion.ctaLink}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToContact(`Promotion Order: ${config.promotion.title}`);
                      }}
                      className="inline-flex items-center gap-3 bg-white text-red-600 px-10 py-5 rounded-full text-lg font-black uppercase italic tracking-widest hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20"
                    >
                      {config.promotion.ctaText}
                      <ChevronRight />
                    </a>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <img 
                  src={config.promotion.image} 
                  alt="Promotion" 
                  className="relative z-10 w-full rounded-[40px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {isEditing && (
                  <input 
                    type="text" 
                    placeholder="Promotion Image URL"
                    value={config.promotion.image}
                    onChange={(e) => setConfig({...config, promotion: {...config.promotion, image: e.target.value}})}
                    className="mt-4 w-full bg-white/20 text-white px-4 py-2 rounded-lg border border-white/30"
                  />
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section id="about" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg mt-8" referrerPolicy="no-referrer" />
                <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-stone-100 max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-xl">10+</div>
                  <div className="font-black uppercase italic text-xs tracking-widest">Years of<br/>Excellence</div>
                </div>
                <p className="text-stone-500 text-xs leading-relaxed">Serving the most delicious burgers in the heart of Constantine since 2016.</p>
              </div>
            </div>

            <div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 mb-8">Why Choose Us?</h2>
              {isEditing ? (
                <textarea 
                  value={config.about.story}
                  onChange={(e) => setConfig({...config, about: {...config.about, story: e.target.value}})}
                  className="w-full bg-white border border-stone-200 p-4 rounded-2xl text-lg mb-8 h-32"
                />
              ) : (
                <p className="text-xl text-stone-600 mb-12 leading-relaxed">
                  {config.about.story}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {config.about.values.map((value, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                    {isEditing ? (
                      <input 
                        value={value}
                        onChange={(e) => {
                          const newValues = [...config.about.values];
                          newValues[idx] = e.target.value;
                          setConfig({...config, about: {...config.about, values: newValues}});
                        }}
                        className="bg-white border border-stone-200 px-2 py-1 rounded text-sm font-bold"
                      />
                    ) : (
                      <span className="font-bold uppercase tracking-widest text-xs text-stone-700">{value}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              {config.about.showTestimonials && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-stone-900">What Our Fans Say</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {config.about.testimonials.map((t) => (
                      <div key={t.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm relative">
                        <div className="flex items-center gap-4 mb-4">
                          <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-black uppercase italic text-sm tracking-tight">{t.name}</h4>
                            <div className="flex text-yellow-400">
                              {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                          </div>
                        </div>
                        <p className="text-stone-600 text-sm italic">"{t.comment}"</p>
                        {isEditing && (
                          <button 
                            onClick={() => setConfig({...config, about: {...config.about, testimonials: config.about.testimonials.filter(test => test.id !== t.id)}})}
                            className="absolute top-4 right-4 text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button 
                        onClick={() => {
                          const newT: Testimonial = {
                            id: Date.now(),
                            name: "New Fan",
                            comment: "Amazing!",
                            rating: 5,
                            image: "https://i.pravatar.cc/150?u=" + Date.now()
                          };
                          setConfig({...config, about: {...config.about, testimonials: [...config.about.testimonials, newT]}});
                        }}
                        className="border-2 border-dashed border-stone-200 rounded-3xl p-4 flex items-center justify-center gap-2 text-stone-400 hover:text-red-600 hover:border-red-600 transition-all"
                      >
                        <Plus size={20} /> Add Testimonial
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter text-stone-900 mb-8">Get In Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm tracking-widest mb-2">Our Location</h4>
                    {isEditing ? (
                      <input 
                        value={config.contact.address}
                        onChange={(e) => setConfig({...config, contact: {...config.contact, address: e.target.value}})}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl"
                      />
                    ) : (
                      <p className="text-stone-500">{config.contact.address}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
                    <Phone size={28} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm tracking-widest mb-2">Phone Number</h4>
                    {isEditing ? (
                      <input 
                        value={config.contact.phone}
                        onChange={(e) => setConfig({...config, contact: {...config.contact, phone: e.target.value}})}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl"
                      />
                    ) : (
                      <p className="text-stone-500">{config.contact.phone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
                    <Mail size={28} />
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic text-sm tracking-widest mb-2">Email Address</h4>
                    {isEditing ? (
                      <input 
                        value={config.contact.email}
                        onChange={(e) => setConfig({...config, contact: {...config.contact, email: e.target.value}})}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl"
                      />
                    ) : (
                      <p className="text-stone-500">{config.contact.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-stone-900 rounded-[40px] text-white">
                <h3 className="text-2xl font-black uppercase italic mb-6">Send Us a Message</h3>
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-600 transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="Phone" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-600 transition-colors" 
                    />
                  </div>
                  <textarea 
                    placeholder="Order Details" 
                    required
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-600 transition-colors h-24"
                  ></textarea>
                  <textarea 
                    placeholder="Notes (Optional)" 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-600 transition-colors h-24"
                  ></textarea>
                  <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-full font-black uppercase italic tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">
                    Send Order via WhatsApp
                  </button>
                </form>
              </div>
            </div>

            <div className="h-full min-h-[500px] rounded-[40px] overflow-hidden border border-stone-100 shadow-2xl">
              <iframe 
                src={`https://maps.google.com/maps?q=${config.contact.mapsCoords}&z=15&output=embed`}
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
                loading="lazy"
              ></iframe>
              {isEditing && (
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-2xl shadow-xl border border-stone-100">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1">Maps Coordinates (Lat,Lng)</label>
                  <input 
                    value={config.contact.mapsCoords}
                    onChange={(e) => setConfig({...config, contact: {...config.contact, mapsCoords: e.target.value}})}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-2 rounded-xl text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                {config.branding.logoUrl ? (
                  <img src={config.branding.logoUrl} alt={config.branding.brandName} className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl italic">
                    {config.branding.brandName.charAt(0)}
                  </div>
                )}
                <span className="text-xl font-black tracking-tighter uppercase italic text-red-600">{config.branding.brandName}</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                The ultimate burger experience in Constantine. Quality, speed, and taste in every bite.
              </p>
              <div className="flex gap-4">
                <a href={config.contact.socials.instagram} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"><Instagram size={20} /></a>
                <a href={config.contact.socials.facebook} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"><Facebook size={20} /></a>
                <a href={config.contact.socials.tiktok} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors font-bold">T</a>
              </div>
            </div>

            <div>
              <h4 className="font-black uppercase italic tracking-widest text-xs mb-8">Quick Navigation</h4>
              <ul className="space-y-4">
                <li><a href="#menu" className="text-stone-400 hover:text-white transition-colors text-sm">Our Menu</a></li>
                <li><a href="#about" className="text-stone-400 hover:text-white transition-colors text-sm">About Story</a></li>
                <li><a href="#promotions" className="text-stone-400 hover:text-white transition-colors text-sm">Special Offers</a></li>
                <li><a href="#contact" className="text-stone-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase italic tracking-widest text-xs mb-8">Contact Info</h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li className="flex items-center gap-3"><Phone size={14} className="text-red-600" /> {config.contact.phone}</li>
                <li className="flex items-center gap-3"><Mail size={14} className="text-red-600" /> {config.contact.email}</li>
                <li className="flex items-center gap-3"><MapPin size={14} className="text-red-600" /> {config.contact.address}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-black uppercase italic tracking-widest text-xs mb-8">Opening Hours</h4>
              <ul className="space-y-4 text-sm text-stone-400">
                <li className="flex justify-between"><span>Mon - Thu:</span> <span className="text-white font-bold">11:00 - 23:00</span></li>
                <li className="flex justify-between"><span>Fri:</span> <span className="text-white font-bold">15:00 - 00:00</span></li>
                <li className="flex justify-between"><span>Sat - Sun:</span> <span className="text-white font-bold">11:00 - 00:00</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600">
            <p>© 2026 Mr Burger. All Rights Reserved.</p>
            <p>Designed with ❤️ for Constantine</p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Order Button */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
        <button 
          onClick={() => scrollToContact()}
          className="w-full bg-red-600 text-white py-4 rounded-full font-black uppercase italic tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-red-600/40 border-4 border-white"
        >
          <ShoppingBag size={20} />
          Order Now
        </button>
      </div>
    </div>
  );
}
