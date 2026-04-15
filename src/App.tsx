
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
  MapPin, Heart, MessageCircle, 
  X, Zap, Send, User, Bell, ChevronLeft
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [activeChatId, setActiveChatId] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  
  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const [events, setEvents] = useState([
    {
      id: "1", title: "Tarkan Konseri", category: "Müzik", date: "12 Kasım, 21:00",
      location: "Harbiye Açık Hava", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
      attendees: 3, maxAttendees: 5, description: "Biletim var ama yalnız gitmek istemiyorum. Enerjisi yüksek bir konser arkadaşı arıyorum! 🎵",
      joined: false, isFavorite: false
    },
    {
      id: "2", title: "Kahve Festivali", category: "Gurme", date: "Hafta Sonu, 10:00",
      location: "Küçükçiftlik Park", image: "https://images.unsplash.com/photo-1447933601403-0c60ef47a707?auto=format&fit=crop&w=800&q=80",
      attendees: 12, maxAttendees: 15, description: "Farklı çekirdekleri denerken sohbet edecek kahve tutkunları arıyoruz. ☕️",
      joined: false, isFavorite: true
    }
  ]);

  const [chats, setChats] = useState([
    {
      id: 101, user: "Melis Y.", avatar: "https://i.pravatar.cc/150?u=1",
      lastMessage: "Konser alanında buluşuruz! 🤘", messages: [
        { id: 1, sender: "me", text: "Selam Melis, konsere ben de geliyorum!", time: "10:30" }
      ]
    }
  ]);

  const filteredEvents = useMemo(() => {
    return activeCategory === "Tümü" ? events : events.filter(ev => ev.category === activeCategory);
  }, [events, activeCategory]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEvents(events.map(ev => ev.id === id ? { ...ev, isFavorite: !ev.isFavorite } : ev));
    showNotification("Liste güncellendi ❤️");
  };

  const handleJoin = (id: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, joined: true, attendees: ev.attendees + 1 } : ev));
    showNotification("Budd-e isteğin gönderildi! 🚀");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChats(chats.map(chat => chat.id === activeChatId ? {
      ...chat, 
      messages: [...chat.messages, { id: Date.now(), sender: 'me', text: newMessage, time: 'Şimdi' }]
    } : chat));
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-start">
      <div className="w-full max-w-md bg-white shadow-2xl h-screen relative flex flex-col border-x border-slate-200">
        
        {/* HEADER */}
        {!activeChatId && (
          <div className="px-6 pt-10 pb-4 bg-white sticky top-0 z-30 border-b border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-black text-indigo-600">Budd-e</h1>
              <div className="flex space-x-2">
                <div className="p-2 bg-slate-100 rounded-full"><Bell size={20}/></div>
                <div className="p-2 bg-slate-100 rounded-full" onClick={() => setActiveTab('profile')}><User size={20}/></div>
              </div>
            </div>
            {activeTab === 'home' && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {['Tümü', 'Müzik', 'Sinema', 'Gurme'].map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{cat}</button>
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
                <div key={event.id} onClick={() => setSelectedEvent(event)} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative">
                  <img src={event.image} className="h-48 w-full object-cover" alt="" />
                  <button onClick={(e) => toggleFavorite(e, event.id)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white">
                    <Heart size={18} fill={event.isFavorite ? "red" : "none"}/>
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
                <div key={chat.id} onClick={() => setActiveChatId(chat.id)} className="flex items-center p-3 bg-slate-50 rounded-2xl">
                  <img src={chat.avatar} className="w-12 h-12 rounded-full mr-4" alt="" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{chat.user}</h4>
                    <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ALT NAVİGASYON */}
        <div className="absolute bottom-6 left-6 right-6 bg-slate-900 rounded-[2rem] p-2 flex justify-around items-center shadow-xl">
          <button onClick={() => setActiveTab('home')} className={`p-3 rounded-full ${activeTab === 'home' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><Zap size={24}/></button>
          <button onClick={() => setActiveTab('chat')} className={`p-3 rounded-full ${activeTab === 'chat' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><MessageCircle size={24}/></button>
          <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-full ${activeTab === 'profile' ? 'bg-white text-indigo-600' : 'text-slate-400'}`}><User size={24}/></button>
        </div>

        {/* MODALLAR (Kısaltılmış) */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-end" onClick={() => setSelectedEvent(null)}>
            <div className="bg-white w-full rounded-t-[3rem] p-8" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
              <p className="text-slate-600 mb-6">{selectedEvent.description}</p>
              <button onClick={() => handleJoin(selectedEvent.id)} className="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600">
                {selectedEvent.joined ? "İstek Gönderildi" : "Budd-e Ol"}
              </button>
            </div>
          </div>
        )}

        {notification && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-2 rounded-full text-xs font-bold z-[100]">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}
