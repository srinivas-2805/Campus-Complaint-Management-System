

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {

  const { user } = useAuth();
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#1e0038] to-[#0a001e] text-white">
      
      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl font-extrabold leading-tight">
              <span className="text-pink-500">Speak Up.</span>
              <br />We’re Listening.
            </h1>
            <p className="text-gray-300 text-lg">
              Raise campus concerns and track resolutions — all in one place.
            </p>
            <Link
              to={user ? "/raise-complaint" : "/register"} 
              className="inline-block bg-pink-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition duration-300 shadow-lg shadow-pink-500/40"
            >
              Get Started
            </Link>
          </div>

        
          <div className="flex justify-center">
            <img
              src="/illustration.png"
              alt="Campus illustration"
              className="w-80 rounded-xl shadow-[0_0_40px_#f472b6]"
            />
          </div>
        </div>
      </div>

      
      <section className="px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            {
              icon: "👤",
              title: "Easy for Students",
              desc: "Simple complaint submission process",
            },
            {
              icon: "✅",
              title: "Track in Real-time",
              desc: "Follow the progress of your complaints",
            },
            {
              icon: "🛠️",
              title: "For Admin & Staff",
              desc: "Manage and resolve issues efficiently",
            },
            {
              icon: "📊",
              title: "Transparent Reports",
              desc: "Gain insights with detailed reports",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#240038] rounded-2xl p-6 shadow-xl hover:scale-105 hover:shadow-pink-500/50 transition duration-300 border border-pink-400/10 backdrop-blur-md"
            >
              <div className="text-4xl mb-4 text-pink-500  drop-shadow-lg">  
                {/* animate-bounce  is removed */}
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

