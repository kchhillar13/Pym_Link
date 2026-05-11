"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, ChevronLeft, Link as LinkIcon, Lock, Globe, Trash2, ExternalLink } from 'lucide-react';

interface LinkData {
  id: string;
  label: string;
  destination_url: string;
  is_private: boolean;
}

export default function ProjectDetail() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLink, setNewLink] = useState({ label: '', destination_url: '', is_private: false });
  const router = useRouter();
  const { projectId } = useParams();

  useEffect(() => {
    fetchLinks();
  }, [projectId]);

  const fetchLinks = async () => {
    try {
      const response = await api.get(`/api/projects/${projectId}/links`);
      setLinks(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/api/projects/${projectId}/links`, newLink);
      setShowModal(false);
      setNewLink({ label: '', destination_url: '', is_private: false });
      fetchLinks();
    } catch (err) {
      alert('Error creating link');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-500 hover:text-indigo-600">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Project Links</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Links</h2>
            <p className="text-gray-500 text-sm">Manage your project's short links</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <Plus size={18} /> Add Link
          </button>
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <div key={link.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                  <LinkIcon size={20} />
                </div>
                <div>
                  <h3 className="font-bold">{link.label}</h3>
                  <p className="text-gray-400 text-xs truncate max-w-xs">{link.destination_url}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${link.is_private ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {link.is_private ? <Lock size={12} /> : <Globe size={12} />}
                  {link.is_private ? 'Private' : 'Public'}
                </div>
                <a 
                  href={link.destination_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-600"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ))}
          {links.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed rounded-lg bg-gray-50 text-gray-500">
              No links yet. Add your first link!
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Label (e.g., github, demo)</label>
                <input 
                  className="w-full border rounded-md px-3 py-2"
                  value={newLink.label}
                  onChange={(e) => setNewLink({...newLink, label: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destination URL</label>
                <input 
                  type="url"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="https://..."
                  value={newLink.destination_url}
                  onChange={(e) => setNewLink({...newLink, destination_url: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="is_private"
                  className="w-4 h-4 text-indigo-600"
                  checked={newLink.is_private}
                  onChange={(e) => setNewLink({...newLink, is_private: e.target.checked})}
                />
                <label htmlFor="is_private" className="text-sm font-medium">Private Link (Requires Auth)</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-600">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Add Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
