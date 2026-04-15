
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Calendar, MapPin, Search, Heart, MessageCircle, 
  ArrowRight, Activity, X, Check, Zap, Send, User, Bell, Map as MapIcon, ChevronLeft,
  Settings, Star, Shield, Smile
} from 'lucide-react';

/**
 * BUDD-E: SOSYAL ETKİNLİK ARKADAŞI UYGULAMASI
 * Bu dosya; TypeScript standartlarında, performans odaklı ve 
 * tamamen fonksiyonel bileşenlerden oluşmaktadır.
 */

export default function App() {
  // --- Durum (State) Yönetimi ---
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [notification, setNotification] = useState(null);
  
  const messagesEndRef = useRef(null);

  // --- Bildirim Fonksiyonu ---
  const showNotification = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // --- Veri Seti (Mock Data) ---
  const [events, setEvents] = useState([
    {
      id: "1", title: "Tarkan Konseri", category: "Müzik", date: "12 Kasım, 21:00",
      location: "Harbiye Açık Hava", coords: { top: '40%', left: '60%' }, 
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
      attendees: 3, maxAttendees: 5, description: "Biletim var ama yalnız gitmek istemiyorum. Enerjisi yüksek bir konser arkadaşı arıyorum! 🎵",
      host: "Melis Y.", hostImage: "https://i.pravatar.cc/150?u=1", joined: false, isFavorite: false
    },
    {
      id: "2", title: "Kahve Festivali", category: "Gurme", date: "Hafta Sonu, 10:00",
      location: "Küçükçiftlik Park", coords: { top: '55%', left: '30%' },
      image: "https://images.unsplash.com/photo-1447933601403-0c60ef47a707?auto=format&fit=crop&w=800&q=80",
      attendees: 12, maxAttendees: 15, description: "Farklı çekirdekleri denerken sohbet edecek kahve tutkunları arıyoruz. ☕️",
      host: "Caner K.", hostImage: "https://i.pravatar.cc/150?u=2", joined: false, isFavorite: true
    },
    {
      id: "3", title: "Joker: İkili Delilik", category: "Sinema", date: "Bu Akşam, 20:30",
      location: "Zorlu PSM", coords: { top: '25%', left: '45%' },
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      attendees: 1, maxAttendees: 2, description: "Sinema sonrası film kritiği yapmayı seven bir 'Budd-e' arıyorum.",
      host: "Zeynep A.", hostImage: "https://i.pravatar.cc/150?u=3", joined: false, isFavorite: false
    }
  ]);

  const [chats, setChats] = useState([
    {
      id: 101, user: "Melis Y.", avatar: "https://i.pravatar.cc/150?u=1",
      lastMessage: "Konser alanında buluşuruz! 🤘", time: "10:42", unread: 2,
      messages: [
        { id: 1, sender: "me", text: "Selam Melis, konsere ben de geliyorum!", time: "10:30" },
        { id: 2, sender: "them", text: "Harika! Çok sevindim.", time: "10:35" },
        { id: 3, sender: "them", text: "Konser alanında buluşuruz! 🤘", time: "10:42" }
      ]
    }
  ]);

  // --- Filtreleme ---
  const filteredEvents = useMemo(() => {
    return activeCategory === "Tümü" ? events : events.filter(ev => ev.category === activeCategory);
  }, [events, activeCategory]);

  // --- Etkileşimler ---
  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setEvents(events.map(ev => ev.id === id ? { ...ev, isFavorite: !ev.isFavorite } : ev));
    showNotification("Liste güncellendi ❤️");
  };

  const handleJoin = (id) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, joined: true, attendees: ev.attendees + 1 } : ev));
    showNotification("Budd-e isteğin gönderildi! 🚀");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChats(chats.map(chat => chat.id === activeChatId ? {
      ...chat, 
      messages: [...chat.messages, { id: Date.now(), sender: 'me', text: newMessage, time: 'Şimdi' }]
    } : chat));
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex justify-center items-start">
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden h-screen relative flex flex-col border-x border-slate-200">
        
        {/* HEADER */}
        {!activeChatId && (
          <div className="px-6 pt-10 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">Budd-e</h1>
              <div className="flex space-x-2">
                <div className="p-2 bg-slate-100 rounded-full"><Bell size={20} className="text-slate-600"/></div>
                <div className="p-2 bg-slate-100 rounded-full" onClick={() => setActiveTab('profile')}><User size={20} className="text-slate-600"/></div>
              </div>
            </div>
            {activeTab === 'home' && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['Tümü', 'Müzik', 'Spor', 'Sinema', 'Gurme'].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>{cat}</button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANA İÇERİK */}
        <div className="flex-1 overflow-y-auto p-5 pb-24">
          {activeTab === 'home' && (
            <div className="space-y-6">
              {filteredEvents.map(event => (
                <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative group">
                  <img src={event.image} className="h-48 w-full object-cover" alt="" />
                  <button onClick={(e) => toggleFavorite(e, event.id)} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                    <Heart size={18} fill={event.isFavorite ? "red" : "none"} className={event.isFavorite ? "text-red-500" : "text-white"}/>
                  </button>
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase">{event.date}</p>
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <div className="flex items-center mt-2 text-slate-500 text-xs"><MapPin size={12} className="mr-1"/>{event.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chat' && !activeChatId && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Mesajlar</h2>
              {chats.map(chat => (
                <div key={chat.id} onClick={() => setActiveChatId(chat.id)} className="flex items-center p-3 bg-slate-50 rounded-2xl cursor-pointer">
                  <img src={chat.avatar} className="w-12 h-12 rounded-full mr-4" alt="" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{chat.user}</h4>
                    <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="text-center pt-10">
              <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={48} className="text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold">Kullanıcı Profili</h2>
              <p className="text-slate-500 text-sm">Üye No: #12345</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-xl font-bold">12</p><p className="text-xs text-slate-400">Etkinlik</p></div>
                <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-xl font-bold">4.8</p><p className="text-xs text-slate-400">Puan</p></div>
              </div>
            </div>
          )}
        </div>

        {/* CHAT DETAY MODALI */}
        {activeChatId && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col">
            <div className="p-4 border-b flex items-center">
              <button onClick={() => setActiveChatId(null)} className="mr-4"><ChevronLeft/></button>
              <h3 className="font-bold">Sohbet</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chats.find(c => c.id === activeChatId).messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl text-sm ${m.sender === 'me' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none" placeholder="Mesaj gönder..."/>
              <button type="submit" className="ml-2 p-2 bg-indigo-600 text-white rounded-full"><Send size={18}/></button>
            </form>
          </div>
        )}

        {/* ALT NAVİGASYON */}
        <div className="absolute bottom-6 left-6 right-6 bg-slate-900 rounded-[2rem] p-2 flex justify-around items-center shadow-xl">
          <button onClick={() => setActiveTab('home')} className={`p-3 rounded-full ${activeTab === 'home' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><Zap size={24}/></button>
          <button onClick={() => setActiveTab('chat')} className={`p-3 rounded-full ${activeTab === 'chat' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><MessageCircle size={24}/></button>
          <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-full ${activeTab === 'profile' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><User size={24}/></button>
        </div>

        {/* ETKİNLİK DETAY MODALI */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end">
            <div className="bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedEvent.title}</h2>
                <button onClick={() => setSelectedEvent(null)} className="p-2 bg-slate-100 rounded-full"><X/></button>
              </div>
              <p className="text-slate-600 text-sm mb-6">{selectedEvent.description}</p>
              <button onClick={() => handleJoin(selectedEvent.id)} disabled={selectedEvent.joined} className={`w-full py-4 rounded-2xl font-bold text-white transition-all ${selectedEvent.joined ? 'bg-green-500' : 'bg-indigo-600 shadow-lg shadow-indigo-200'}`}>
                {selectedEvent.joined ? "İstek Gönderildi" : "Budd-e Ol"}
              </button>
            </div>
          </div>
        )}

        {/* TOAST BİLDİRİM */}
        {notification && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-2 rounded-full text-xs font-bold z-[100] shadow-2xl animate-bounce">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}
