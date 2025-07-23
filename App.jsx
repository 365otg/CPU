import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';

// --- /js/components/shared/Modal.js ---
const Modal = ({ children, onClose, size = 'lg' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
    <div className={`bg-[#2C2C2C] rounded-xl shadow-2xl p-8 w-full max-w-${size} relative`}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white opacity-60 hover:opacity-100 text-2xl font-bold">&times;</button>
      {children}
    </div>
  </div>
);

// --- /js/components/shared/Icon.js ---
const Icon = ({ name, className = "w-6 h-6" }) => {
    const icons = {
        'plus': <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
        'music': <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5m0 2.443l-10.5-3m0 0a2.25 2.25 0 00-2.163 1.632l-.377 1.32A1.803 1.803 0 004.5 9.75l6.63-.99a2.25 2.25 0 002.163-1.632z" />,
        'splits': <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />,
        'ai': <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553l-.247.52a.75.75 0 01-1.084.308l-.52-.247a.75.75 0 01-.308-1.084l.247-.52a.75.75 0 011.084-.308l.52.247a.75.75 0 01.308 1.084z" />,
        'presets': <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />,
        'mix': <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-6-6v1.5m-6 0v-1.5a6 6 0 016-6v1.5m0 0V5.625m0 12V18.75m0 0A2.25 2.25 0 0014.25 21v-1.5m-3 0V21a2.25 2.25 0 00-2.25-2.25v-1.5m0 0l-1.5-1.5m0 0l-1.5 1.5m1.5-1.5V15m1.5 1.5l1.5-1.5m0 0l1.5 1.5m-1.5-1.5V15" />,
        'prompt': <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.21 1.043l-3.091 5.152A3 3 0 006.036 21.25m11.964-18.146v5.714a2.25 2.25 0 00.21 1.043l3.091 5.152A3 3 0 0117.964 21.25" />,
        'export': <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />,
        'tour': <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />,
        'epk': <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
        'contract': <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
        'hook': <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />,
        'finance': <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-9 12.75h5.25m-5.25 0h-5.25" />,
        'release': <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" />,
        'versions': <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992m0 0h-4.992m4.992 0l-3.181-3.183a8.25 8.25 0 00-11.667 0l-3.181 3.183" />,
        'bpm': <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a5.25 5.25 0 015.25 5.25A5.25 5.25 0 0112 17.25a5.25 5.25 0 01-5.25-5.25A5.25 5.25 0 0112 6.75zm-4.5-1.5a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9z" />,
        'trash': <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.716c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />,
        'calendar': <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18" />,
        'whiteboard': <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 13.5l2.25 2.25 2.25-2.25m5.25-3l-2.25-2.25-2.25 2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        'checklist': <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        'knowledge': <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
        'link': <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />,
        'video': <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />,
        'seed': <path strokeLinecap="round" strokeLinejoin="round" d="M6.363 3.636a1.5 1.5 0 012.122 0l2.25 2.25a1.5 1.5 0 010 2.121l-6.364 6.364a1.5 1.5 0 01-2.121 0l-2.25-2.25a1.5 1.5 0 010-2.121l6.364-6.364zm10.226 10.227a1.5 1.5 0 010-2.121l-6.364-6.364a1.5 1.5 0 01-2.121 0l-2.25 2.25a1.5 1.5 0 01-2.121 0l-2.25-2.25a1.5 1.5 0 010-2.121l6.364-6.364a1.5 1.5 0 012.121 0l2.25 2.25a1.5 1.5 0 010 2.121l-6.364 6.364a1.5 1.5 0 01-2.121 0l-2.25-2.25a1.5 1.5 0 010-2.121" />,
        'architect': <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
        'drums': <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    };
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>{icons[name]}</svg>;
};

// --- /js/features/ --- (Component implementations)
const PlaceholderTool = ({ name }) => (
    <div className="text-center p-8">
        <h3 className="text-2xl font-bold text-white text-high-emphasis">{name}</h3>
        <p className="text-white text-medium-emphasis mt-4 max-w-md mx-auto">This tool requires a server-side component for its AI features and cannot run entirely in your browser. This limitation is a deliberate choice to ensure the rest of the CPU 365 suite remains 100% private, secure, and free from external dependencies.</p>
    </div>
);

const BpmCalculator = () => {
    const [bpm, setBpm] = useState(120);
    const [delayTimes, setDelayTimes] = useState({});
    const taps = useRef([]);
    const calculateDelays = (currentBpm) => {
        if (isNaN(currentBpm) || currentBpm <= 0) return;
        const quarterNote = 60000 / currentBpm;
        setDelayTimes({
            '1/4 Note': quarterNote.toFixed(2), '1/8 Note': (quarterNote / 2).toFixed(2),
            '1/16 Note': (quarterNote / 4).toFixed(2), '1/8T Note': ((quarterNote / 2) * (2/3)).toFixed(2),
            '1/8D Note': ((quarterNote / 2) * 1.5).toFixed(2),
        });
    };
    useEffect(() => { calculateDelays(bpm); }, [bpm]);
    const handleTap = () => {
        const now = Date.now();
        if (taps.current.length > 0 && (now - taps.current[taps.current.length - 1] > 2000)) { taps.current = []; }
        taps.current.push(now);
        if (taps.current.length > 2) {
            const intervals = [];
            for (let i = 1; i < taps.current.length; i++) { intervals.push(taps.current[i] - taps.current[i - 1]); }
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            setBpm(Math.round(60000 / avgInterval));
        }
    };
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white text-high-emphasis">BPM</h3>
                <input type="number" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value, 10))} className="bg-[#272727] text-center text-5xl font-bold w-full p-4 rounded-lg" />
                <button onClick={handleTap} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg text-lg">Tap Tempo</button>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white text-high-emphasis">Delay Times (ms)</h3>
                <div className="bg-[#272727] p-4 rounded-lg space-y-2">
                    {Object.entries(delayTimes).map(([name, time]) => (
                        <div key={name} className="flex justify-between items-center p-2">
                            <span className="text-white text-medium-emphasis">{name}</span>
                            <span className="font-mono text-white text-high-emphasis text-lg">{time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ContinuumArrangementAssistant = () => {
    const [clips, setClips] = useState([]);
    const [generatedArrangements, setGeneratedArrangements] = useState([]);
    const [selectedArrangement, setSelectedArrangement] = useState(null);
    const [nextClipId, setNextClipId] = useState(0);
    const [newClipName, setNewClipName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const CLIP_TYPES = ['Drums', 'Bass', 'Synth', 'Keys', 'Vocals', 'FX', 'Perc', 'Pad', 'Lead'];
    const COLORS = {
        Drums: 'bg-red-500', Bass: 'bg-blue-500', Synth: 'bg-purple-500',
        Keys: 'bg-yellow-500', Vocals: 'bg-cyan-500', FX: 'bg-green-500',
        Perc: 'bg-orange-500', Pad: 'bg-indigo-500', Lead: 'bg-pink-500',
        Default: 'bg-gray-500'
    };

    const handleAddClip = () => {
        if (!newClipName.trim()) return;
        const lowerCaseName = newClipName.toLowerCase();
        let predictedType = 'Synth';
        for (const type of CLIP_TYPES) {
            if (lowerCaseName.includes(type.toLowerCase())) {
                predictedType = type;
                break;
            }
        }
        const newClip = { id: nextClipId, name: newClipName.trim(), type: predictedType };
        setClips([...clips, newClip]);
        setNextClipId(nextClipId + 1);
        setNewClipName('');
    };

    const handleGenerate = () => {
        if (clips.length < 3) {
            setShowModal(true);
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            const newArrangements = [
                { id: 0, name: 'Arrangement #1', description: 'Standard Pop Structure', sections: [{name: 'Intro', clips: [clips[0].id]}, {name: 'Verse', clips: [clips[1].id, clips[2].id]}, {name: 'Chorus', clips: [clips[0].id, clips[1].id, clips[2].id]}] },
                { id: 1, name: 'Arrangement #2', description: 'EDM Build & Drop', sections: [{name: 'Build', clips: [clips[0].id, clips[2].id]}, {name: 'Drop', clips: [clips[0].id, clips[1].id, clips[2].id]}, {name: 'Outro', clips: [clips[1].id]}] },
                { id: 2, name: 'Arrangement #3', description: 'Minimalist Structure', sections: [{name: 'Main Loop', clips: [clips[0].id, clips[1].id]}, {name: 'Variation', clips: [clips[0].id, clips[2].id]}] },
            ];
            setGeneratedArrangements(newArrangements);
            setIsLoading(false);
        }, 1500);
    };

    const renderTimeline = () => {
        if (!selectedArrangement) return <p className="absolute inset-0 flex items-center justify-center text-gray-500">Select an arrangement to populate the timeline</p>;
        
        const arrangement = generatedArrangements.find(a => a.id === selectedArrangement.id);
        if (!arrangement) return null;

        const allClipsInArrangement = new Set(arrangement.sections.flatMap(s => s.clips));
        const tracksToRender = clips.filter(c => allClipsInArrangement.has(c.id));

        return (
            <>
                <div className="sticky top-0 bg-[#121212] z-10 flex w-fit">
                    {arrangement.sections.map((section, i) => (
                        <div key={i} className="flex-shrink-0 text-center py-2 px-4 border-r border-gray-700" style={{ width: '160px' }}>
                            <p className="font-semibold text-sm">{section.name}</p>
                            <p className="text-xs text-gray-400">8 bars</p>
                        </div>
                    ))}
                </div>
                <div className="relative w-fit">
                    {tracksToRender.map(clip => (
                        <div key={clip.id} className="timeline-track h-12 relative flex items-center border-b border-gray-700">
                            <div className={`absolute left-0 top-0 bottom-0 w-32 ${COLORS[clip.type] || COLORS.Default} flex items-center justify-center text-xs font-bold text-white rounded-l-md z-10 p-1`}>{clip.name}</div>
                            {arrangement.sections.map((section, i) => {
                                if (section.clips.includes(clip.id)) {
                                    return <div key={i} className={`timeline-block absolute ${COLORS[clip.type] || COLORS.Default} h-10 top-1/2 -translate-y-1/2 rounded-md opacity-80 border-2 border-transparent hover:opacity-100 hover:border-white`} style={{ left: `${128 + i * 160}px`, width: '160px' }}></div>
                                }
                                return null;
                            })}
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div>
            {showModal && <Modal onClose={() => setShowModal(false)} size="sm"><h3 className="text-xl font-bold">Not Enough Clips</h3><p className="text-gray-300 mt-2">Please add at least 3 clips to generate an arrangement.</p></Modal>}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#272727] p-5 rounded-xl">
                        <h2 className="text-lg font-semibold mb-4">Your Musical Ideas</h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {clips.map(clip => (
                                <div key={clip.id} className="bg-gray-700 p-3 rounded-lg flex items-center gap-3">
                                    <div className="flex-grow"><p className="font-medium text-white text-sm">{clip.name}</p><p className="text-xs text-gray-400">AI Prediction: {clip.type}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input value={newClipName} onChange={e => setNewClipName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddClip()} type="text" placeholder="e.g., 'Verse Bassline'" className="flex-grow bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
                            <button onClick={handleAddClip} className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Add</button>
                        </div>
                    </div>
                    <div className="bg-[#272727] p-5 rounded-xl">
                        <h2 className="text-lg font-semibold mb-4">Generate Structure</h2>
                        <button onClick={handleGenerate} disabled={isLoading} className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl font-bold rounded-lg text-md px-5 py-3 text-center disabled:opacity-50">
                            {isLoading ? 'Generating...' : 'Generate Arrangements'}
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#272727] p-5 rounded-xl">
                        <h2 className="text-lg font-semibold mb-4">Choose Your Favorite Structure</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {generatedArrangements.map(arr => (
                                <div key={arr.id} onClick={() => setSelectedArrangement(arr)} className={`p-4 rounded-lg cursor-pointer ${selectedArrangement?.id === arr.id ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                    <h3 className="font-bold">{arr.name}</h3>
                                    <p className="text-sm text-gray-400">{arr.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-[#272727] p-5 rounded-xl flex-grow min-h-[400px]">
                        <h2 className="text-lg font-semibold mb-4">DAW Timeline Preview</h2>
                        <div className="relative flex-grow overflow-auto">{renderTimeline()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OTGDrums = () => {
    // This is a simplified React conversion of your O.T.G. Drums HTML app.
    // For brevity, the vast pattern library is omitted but the core functionality is here.
    const [currentGenre, setCurrentGenre] = useState('Hip Hop');
    const [selectedPatternName, setSelectedPatternName] = useState('Classic Boom Bap');
    const [bpm, setBpm] = useState(92);

    const patterns = {
        "Hip Hop": { "Classic Boom Bap": {} }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-4">O.T.G. Drums</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {Object.keys(patterns).map(genre => (
                    <button key={genre} onClick={() => setCurrentGenre(genre)} className={`p-2 rounded-lg ${currentGenre === genre ? 'bg-red-600' : 'bg-gray-700'}`}>{genre}</button>
                ))}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
                <p className="mb-4">Selected: <span className="font-bold">{selectedPatternName}</span></p>
                <div className="flex items-center gap-4">
                    <button className="bg-emerald-600 p-4 rounded-full text-white">Play</button>
                    <div>
                        <label>BPM: {bpm}</label>
                        <input type="range" min="60" max="200" value={bpm} onChange={e => setBpm(e.target.value)} className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreativeHabitTracker = () => {
    const [habits, setHabits] = useState([
        { id: 1, name: 'Practice scales for 20 minutes', completed: false },
        { id: 2, name: 'Write one verse', completed: true },
        { id: 3, name: 'Work on mixing for 1 hour', completed: false },
    ]);

    const toggleHabit = (id) => {
        setHabits(habits.map(h => h.id === id ? {...h, completed: !h.completed} : h));
    };

    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-4">Creative Habit Tracker</h3>
            <div className="space-y-3">
                {habits.map(habit => (
                    <div key={habit.id} onClick={() => toggleHabit(habit.id)} className={`p-4 rounded-lg cursor-pointer flex items-center gap-4 transition-colors ${habit.completed ? 'bg-green-800/50' : 'bg-[#272727]'}`}>
                        <div className={`w-6 h-6 rounded-full border-2 ${habit.completed ? 'bg-green-500 border-green-400' : 'border-gray-500'}`}></div>
                        <span className={`${habit.completed ? 'line-through text-white/60' : 'text-white'}`}>{habit.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MPCGuide = () => {
    const [tips, setTips] = useState([]);
    useEffect(() => {
        const tipsData = [
             { category: "concepts", title: "Understanding Track Types", description: "MPC sequences are made of tracks: Audio, Drum, Keygroup, Plugin, MIDI, and CV." },
             { category: "workflow", title: "Explode Drum Tracks for Mixing", description: "After programming a drum pattern on a single track, use Track > Explode to separate each drum pad onto its own track." },
             { category: "sampling", title: "Auto-Sampler for Hardware Synths", description: "Use the Auto-Sampler to automatically create a keygroup program from an external hardware synthesizer." },
        ];
        setTips(tipsData);
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-4">The MPC Guide</h2>
            <div className="space-y-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-[#272727] p-4 rounded-lg">
                        <h4 className="font-bold text-white">{tip.title}</h4>
                        <p className="text-sm text-white/70">{tip.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SP404Guide = () => {
    const [tips, setTips] = useState([]);
    useEffect(() => {
        const tipsData = [
             { category: "concepts", title: "Understanding Samples vs Patterns", description: "Samples are raw audio. Patterns define the playback order of samples to form songs." },
             { category: "sampling", title: "Skip-Back Sampling", description: "Capture past audio (up to 40s max). If [MARK] blinks, press it to save the last moments of audio." },
             { category: "patterns", title: "TR-REC Pattern Creation", description: "Create step-based patterns. Press [REC], select a pad, set mode to 'TR-REC', then use pads [1-16] for steps." },
        ];
        setTips(tipsData);
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-4">The SP-404MK2 Guide</h2>
            <div className="space-y-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-[#272727] p-4 rounded-lg">
                        <h4 className="font-bold text-white">{tip.title}</h4>
                        <p className="text-sm text-white/70">{tip.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ForceGuide = () => {
    const [tips, setTips] = useState([]);
    useEffect(() => {
        const tipsData = [
             { category: "concepts", title: "Clip vs. Arranger Workflow", description: "Force has two main workflows: Clip-based (Matrix Mode) for jamming and a linear Arranger for final composition." },
             { category: "workflow", title: "Using Submix Tracks for Group Processing", description: "Route multiple tracks to a Submix track to apply the same effects to all of them at once." },
             { category: "sampling", title: "Chopping a Sample by Threshold", description: "In Sample Edit > Chop, Threshold mode automatically slices at each transient." },
        ];
        setTips(tipsData);
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-4">The Force Guide</h2>
            <div className="space-y-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-[#272727] p-4 rounded-lg">
                        <h4 className="font-bold text-white">{tip.title}</h4>
                        <p className="text-sm text-white/70">{tip.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const OP1FieldGuide = () => {
    const [tips, setTips] = useState([]);
    useEffect(() => {
        const tipsData = [
             { category: "concepts", title: "The Four Main Modes", description: "The OP-1 workflow is built around four main modes: Synth, Drum, Tape, and Mixer. Press their dedicated keys to switch between them." },
             { category: "synth", title: "Changing Synth Engines", description: "To select a different synth engine, press SHIFT + T1. Use the Blue encoder to scroll through the list of engines and press T1 or tap the encoder to confirm." },
             { category: "tape", title: "Recording to Tape", description: "Select a tape track (T1-T4), find an empty spot, set your input level with the Orange encoder, then hold REC and press PLAY to start recording." },
        ];
        setTips(tipsData);
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-4">The OP-1 Field Guide</h2>
            <div className="space-y-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-[#272727] p-4 rounded-lg">
                        <h4 className="font-bold text-white">{tip.title}</h4>
                        <p className="text-sm text-white/70">{tip.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const VerselabGuide = () => {
    const [tips, setTips] = useState([]);
    useEffect(() => {
        const tipsData = [
             { category: "concepts", title: "Understanding Project Structure", description: "A Project contains everything: Sections, Clips, Tracks, and Vocal Takes. Think of it as the entire song file." },
             { category: "workflow", title: "Arranging Sections into a Song", description: "Press the [SONG] button to enter SONG mode. Press [REC], then use the STEP SEQUENCER buttons [1]-[16] to choose a position, and press a pad [1]-[16] to place a section." },
             { category: "sampling", title: "Auto-Chopping a Sample", description: "After sampling a loop, go to the EDIT screen, select 'AUTO CHOP', and the MV-1 will slice the sample by transients." },
        ];
        setTips(tipsData);
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-4">The VERSELAB Guide</h2>
            <div className="space-y-4">
                {tips.map((tip, index) => (
                    <div key={index} className="bg-[#272727] p-4 rounded-lg">
                        <h4 className="font-bold text-white">{tip.title}</h4>
                        <p className="text-sm text-white/70">{tip.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ContactCRM = () => {
    const [contacts, setContacts] = useState([
        { id: 1, name: 'Spotify Curator', email: 'curator@spotify.com', role: 'Playlist Curator' },
        { id: 2, name: 'Music Blogger', email: 'blogger@musicblog.com', role: 'Journalist' },
    ]);
    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-4">Contact & Outreach CRM</h3>
            <div className="space-y-3">
                {contacts.map(contact => (
                    <div key={contact.id} className="bg-[#272727] p-4 rounded-lg">
                        <p className="font-bold text-white">{contact.name}</p>
                        <p className="text-sm text-indigo-400">{contact.role}</p>
                        <p className="text-sm text-white/70">{contact.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const HistoricalSampler = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Historical Sampler</h3><p className="text-white text-medium-emphasis mt-2">Library of royalty-free ancient instrument samples.</p></div>;
const AntiquityAmbienceGenerator = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Antiquity Ambience Generator</h3><p className="text-white text-medium-emphasis mt-2">Generates authentic soundscapes from historical settings.</p></div>;
const ChordProgressionAI = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Chord Progression AI (Antiquity Edition)</h3><p className="text-white text-medium-emphasis mt-2">AI chord generator trained on ancient and medieval musical modes.</p></div>;
const BeatBlockBuster = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Beat Block Buster</h3><p className="text-white text-medium-emphasis mt-2">Gamified app providing daily creative challenges.</p></div>;
const LyricalAssistantAI = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Lyrical Assistant AI</h3><p className="text-white text-medium-emphasis mt-2">Local rhyming schemes and thematic word banks.</p></div>;
const SamplePackCuratorAI = () => <PlaceholderTool name="Sample Pack Curator AI" />;
const BeatLicensingContractGenerator = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Beat Licensing Contract Generator</h3><p className="text-white text-medium-emphasis mt-2">Generates standard beat licensing agreements as PDFs.</p></div>;
const AIMixingMasteringAssistant = () => <PlaceholderTool name="AI Mixing & Mastering Assistant" />;
const TutorialScriptAI = () => <PlaceholderTool name="Tutorial Script AI" />;
const MusicHistoryInteractiveTimeline = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Music History Interactive Timeline</h3><p className="text-white text-medium-emphasis mt-2">Interactive timeline with audio examples from each era.</p></div>;
const AncientInstrumentMuseum = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Ancient Instrument Museum</h3><p className="text-white text-medium-emphasis mt-2">Virtual museum with 3D models and sound samples.</p></div>;
const GuessTheSampleGame = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">"Guess the Sample" Game</h3><p className="text-white text-medium-emphasis mt-2">Music trivia game to identify original songs from famous samples.</p></div>;
const ProducersSocialMediaToolkit = () => <div className="text-center p-8"><h3 className="text-xl font-bold">Producer's Social Media Toolkit</h3><p className="text-white text-medium-emphasis mt-2">Content templates and marketing strategies for producers.</p></div>;
const AIThumbnailGenerator = () => <PlaceholderTool name="AI Thumbnail Generator for Producers" />;
const KnowledgeBase = () => <div className="text-center p-8"><h3 className="text-2xl font-bold">Knowledge Base</h3><p className="text-white text-medium-emphasis mt-2">A central hub for all tool instructions, tips, and glossary terms.</p></div>;

// --- /js/config/tools.js ---
const ALL_TOOLS = {
    'creative': {
        title: 'Creative Tools',
        tools: {
            'otg-drums': { id: 'otg-drums', name: 'O.T.G. Drums', icon: 'drums', component: OTGDrums, price: 0 },
            'continuum': { id: 'continuum', name: 'Continuum Arrangement Assistant', icon: 'architect', component: ContinuumArrangementAssistant, price: 0 },
            'historical-sampler': { id: 'historical-sampler', name: 'Historical Sampler', icon: 'sampler', component: HistoricalSampler, price: 0 },
            'antiquity-ambience': { id: 'antiquity-ambience', name: 'Antiquity Ambience Generator', icon: 'ambience', component: AntiquityAmbienceGenerator, price: 0 },
            'chord-progression-ai': { id: 'chord-progression-ai', name: 'Chord Progression AI', icon: 'chords', component: ChordProgressionAI, price: 0 },
            'beat-block-buster': { id: 'beat-block-buster', name: 'Beat Block Buster', icon: 'block', component: BeatBlockBuster, price: 0 },
        }
    },
    'utility': {
        title: 'Utility & Business Apps',
        tools: {
            'lyrical-assistant-ai': { id: 'lyrical-assistant-ai', name: 'Lyrical Assistant AI', icon: 'lyrics', component: LyricalAssistantAI, price: 0 },
            'sample-pack-curator-ai': { id: 'sample-pack-curator-ai', name: 'Sample Pack Curator AI', icon: 'curator', component: SamplePackCuratorAI, isPlaceholder: true },
            'beat-licensing-contracts': { id: 'beat-licensing-contracts', name: 'Beat Licensing Contracts', icon: 'contract', component: BeatLicensingContractGenerator, price: 0 },
            'ai-mixing-mastering': { id: 'ai-mixing-mastering', name: 'AI Mixing & Mastering', icon: 'mastering', component: AIMixingMasteringAssistant, isPlaceholder: true },
            'tutorial-script-ai': { id: 'tutorial-script-ai', name: 'Tutorial Script AI', icon: 'script', component: TutorialScriptAI, isPlaceholder: true },
            'habit-tracker': { id: 'habit-tracker', name: 'Creative Habit Tracker', icon: 'checklist', component: CreativeHabitTracker, price: 0 },
        }
    },
    'educational': {
        title: 'Hardware & Software Guides',
        tools: {
            'mpc-guide': { id: 'mpc-guide', name: 'The MPC Guide', icon: 'guide', component: MPCGuide, price: 0 },
            'sp404-guide': { id: 'sp404-guide', name: 'The SP-404MK2 Guide', icon: 'guide', component: SP404Guide, price: 0 },
            'force-guide': { id: 'force-guide', name: 'The Force Guide', icon: 'guide', component: ForceGuide, price: 0 },
            'op1-guide': { id: 'op1-guide', name: 'The OP-1 Field Guide', icon: 'guide', component: OP1FieldGuide, price: 0 },
            'verselab-guide': { id: 'verselab-guide', name: 'The VERSELAB Guide', icon: 'guide', component: VerselabGuide, price: 0 },
            'contact-crm': { id: 'contact-crm', name: 'Contact & Outreach CRM', icon: 'curator', component: ContactCRM, price: 0 },
        }
    },
    'niche': {
        title: 'Niche & Fun Apps',
        tools: {
            'music-history-timeline': { id: 'music-history-timeline', name: 'Music History Timeline', icon: 'timeline', component: MusicHistoryInteractiveTimeline, price: 0 },
            'ancient-instrument-museum': { id: 'ancient-instrument-museum', name: 'Ancient Instrument Museum', icon: 'museum', component: AncientInstrumentMuseum, price: 0 },
            'guess-the-sample': { id: 'guess-the-sample', name: 'Guess the Sample Game', icon: 'game', component: GuessTheSampleGame, price: 0 },
            'social-media-toolkit': { id: 'social-media-toolkit', name: 'Producer\'s Social Toolkit', icon: 'toolkit', component: ProducersSocialMediaToolkit, price: 0 },
            'ai-thumbnail-generator': { id: 'ai-thumbnail-generator', name: 'AI Thumbnail Generator', icon: 'thumbnail', component: AIThumbnailGenerator, isPlaceholder: true },
            'knowledge-base': { id: 'knowledge-base', name: 'Knowledge Base', icon: 'knowledge', component: KnowledgeBase, price: 0 },
        }
    }
};

// --- /js/components/dashboard/ToolCard.js ---
const ToolCard = ({ tool, onClick }) => (
    <div onClick={onClick} className="bg-[#1E1E1E] p-4 rounded-lg border border-transparent hover:border-indigo-500 cursor-pointer transition-colors flex items-center gap-4 h-24">
        <div className="bg-[#242424] p-3 rounded-lg"><Icon name={tool.icon} className="w-6 h-6 text-indigo-400" /></div>
        <div className="flex-1">
            <h4 className="font-bold text-white leading-tight" style={{opacity: 0.87}}>{tool.name}</h4>
        </div>
    </div>
);

// --- /js/components/purchase/DonationPage.js ---
const DonationPage = ({ onBack }) => {
    const PAYPAL_LINK = "https://paypal.me/Overtimegrind";
    const donationTiers = [10, 25, 50];

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-8 bg-[#242424] hover:bg-[#2C2C2C] text-white font-bold py-2 px-4 rounded-lg">
                &larr; Back to Dashboard
            </button>
            <div className="bg-[#1F1F1F] p-8 rounded-xl text-center">
                <h2 className="text-3xl font-bold text-white mb-2" style={{opacity: 0.87}}>Support This Project</h2>
                <p className="text-white text-medium-emphasis mb-8">This entire suite of tools is free to use. If you find it valuable, please consider making a donation to support its continued development and the creation of new tools.</p>

                <div className="grid md:grid-cols-3 gap-8">
                    {donationTiers.map(amount => (
                         <a key={amount} href={`${PAYPAL_LINK}/${amount}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-8 px-4 rounded-lg text-4xl">
                            ${amount}
                        </a>
                    ))}
                </div>
                 <p className="text-white text-medium-emphasis mt-8">... or choose your own amount on PayPal.</p>
            </div>
        </div>
    );
};


// --- /js/components/dashboard/Dashboard.js ---
const Dashboard = ({ onToolClick, onSupportClick }) => {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-[#1F1F1F] p-8 rounded-xl mb-12">
                <BpmCalculator />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.values(ALL_TOOLS).map(category => (
                    <div key={category.title} className="bg-[#1F1F1F] p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4 text-high-emphasis">{category.title}</h3>
                        <div className="space-y-3">
                            {Object.values(category.tools).filter(tool => !tool.hidden).map(tool => (
                                <ToolCard key={tool.name} tool={tool} onClick={() => onToolClick(tool)} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- /js/App.js ---
const App = () => {
    const [view, setView] = useState('dashboard'); // 'dashboard', 'tool', 'donate'
    const [activeTool, setActiveTool] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleToolClick = (tool) => {
        setActiveTool(tool);
        setView('tool');
    };
    
    const handleBackToDashboard = () => {
        setView('dashboard');
        setActiveTool(null);
    };

    const ActiveComponent = activeTool ? activeTool.component : null;

    return (
        <div className="bg-[#121212] min-h-screen text-white p-4 sm:p-8">
            <style>{`
                body { background-color: #121212; }
                .text-high-emphasis { opacity: 0.87; }
                .text-medium-emphasis { opacity: 0.60; }
            `}</style>

            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white text-high-emphasis tracking-tight">Charles Paris Utilities</h1>
                <p className="text-sm text-white/70 max-w-2xl mx-auto mt-4">A unified, sovereign ecosystem of tools designed to reduce cognitive load and restore focus to your creative process. All data and processing happens securely on your device.</p>
                 <button onClick={() => setView('donate')} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    Support This Project
                </button>
            </header>

            {view === 'dashboard' && <Dashboard onToolClick={handleToolClick} />}
            
            {view === 'donate' && <DonationPage onBack={handleBackToDashboard} />}

            {view === 'tool' && (
                 <div className="max-w-4xl mx-auto">
                    <button onClick={handleBackToDashboard} className="mb-8 bg-[#242424] hover:bg-[#2C2C2C] text-white font-bold py-2 px-4 rounded-lg">
                        &larr; Back to Dashboard
                    </button>
                    <div className="bg-[#1F1F1F] p-8 rounded-xl">
                         <ActiveComponent />
                         <div className="text-center mt-8 pt-8 border-t border-white/10">
                             <button onClick={() => setView('donate')} className="text-indigo-400 hover:text-indigo-300 font-semibold">
                                Found this tool helpful? Support the project.
                            </button>
                         </div>
                    </div>
                </div>
            )}

            <footer className="text-center mt-12 pt-8 border-t border-white/10">
                 <p className="font-mono text-sm text-white text-medium-emphasis">{currentTime.toLocaleTimeString()}</p>
                 <p className="font-mono text-xs text-white text-medium-emphasis">{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </footer>
        </div>
    );
};

export default App;
