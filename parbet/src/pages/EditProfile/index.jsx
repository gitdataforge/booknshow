import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
    const navigate = useNavigate();
    return (
        <div className="w-full pb-20 animate-fade-in">
            <h1 className="text-3xl font-black text-brand-text mb-6">EditProfile</h1>
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
                <p className="text-brand-muted mb-4">Content for EditProfile module.</p>
                <button onClick={() => navigate(-1)} className="bg-brand-panel border border-brand-border px-6 py-2 rounded-xl text-sm font-bold text-brand-text hover:bg-gray-100 transition-colors">Go Back</button>
            </div>
        </div>
    );
}