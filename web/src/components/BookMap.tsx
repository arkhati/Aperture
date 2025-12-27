"use client";

import { MapPin, User, Calendar } from "lucide-react";

interface Event {
    order: number;
    title: string;
    location: string;
    description: string;
    characters: string[];
}

interface BookMapProps {
    data: Event[];
}

const BookMap = ({ data }: BookMapProps) => {
    // Sort by order just in case
    const sortedEvents = [...data].sort((a, b) => a.order - b.order);

    return (
        <div className="bg-slate-950 border border-white/10 rounded-2xl p-8 max-h-[600px] overflow-y-auto custom-scrollbar relative">
            {/* Background Line */}
            <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-pink-500/50" />

            <div className="space-y-12">
                {sortedEvents.map((event, index) => (
                    <div key={index} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:text-right" : "md:flex-row-reverse"}`}>

                        {/* Timeline Dot */}
                        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)] z-10 mt-1.5" />

                        {/* Content */}
                        <div className={`flex-1 pl-16 md:pl-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                            <div className="group bg-slate-900/40 hover:bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 p-6 rounded-xl transition-all duration-300">
                                <div className={`flex flex-col gap-2 ${index % 2 === 0 ? "md:items-end" : "md:items-start"}`}>

                                    <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2 py-1 rounded w-fit">
                                        Event {event.order}
                                    </span>

                                    <h4 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                                        {event.title}
                                    </h4>

                                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                                        <MapPin size={14} className="text-pink-400" />
                                        {event.location}
                                    </div>

                                    <p className="text-slate-300 leading-relaxed text-sm">
                                        {event.description}
                                    </p>

                                    {event.characters && event.characters.length > 0 && (
                                        <div className={`flex flex-wrap gap-2 mt-3 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                                            {event.characters.map((char, c) => (
                                                <span key={c} className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-full text-slate-400 border border-white/5">
                                                    <User size={10} />
                                                    {char}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* Empty spacer for opposite side layout */}
                        <div className="hidden md:block flex-1" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookMap;
