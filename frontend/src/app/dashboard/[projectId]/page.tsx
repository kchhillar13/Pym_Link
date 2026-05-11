"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, ChevronLeft, Link as LinkIcon, Lock, Globe, Trash2, ExternalLink, Copy, Check } from 'lucide-react';

interface LinkData {
  id: string;
  label: string;
  destination_url: string;
  is_private: boolean;
}

interface ProjectData {
  id: string;
  slug: string;
  title: string;
}

export default function ProjectDetail() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLink, setNewLink] = useState({ label: '', destination_url: '', is_private: false });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const router = useRouter();
  const { projectId } = useParams();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_REDIRECT_URL || 'https://pym-link.onrender.com';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchProjectAndLinks();
  }, [projectId]);

  const fetchProjectAndLinks = async () => {
    try {
      const [linksRes, projectsRes] = await Promise.all([
        api.get(`/api/projects/${projectId}/links`),
        api.get('/api/projects')
      ]);
      
      setLinks(linksRes.data);
      const currentProject = projectsRes.data.find((p: any) => p.id === projectId);
      setProject(currentProject);
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
      fetchProjectAndLinks();
    } catch (err) {
      alert('Error creating link');
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await api.delete(`/api/links/${linkId}`);
      fetchProjectAndLinks();
    } catch (err) {
      alert('Error deleting link');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-gray-500 hover:text-indigo-600">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">{project?.title || 'Project Links'}</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Links</h2>
            <p className="text-gray-500 text-sm">Manage your short links for <strong>{project?.slug}</strong></p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <Plus size={18} /> Add Link
          </button>
        </div>

        <div className="space-y-4">
          {links.map((link) => {
            const shortUrl = `${BACKEND_URL}/${user?.username}/${project?.slug}/${link.label}`;
            return (
              <div key={link.id} className="bg-white p-5 rounded-lg border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <LinkIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900">{link.label}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-indigo-600 truncate max-w-[200px] md:max-w-xs">{shortUrl}</span>
                      <button 
                        onClick={() => copyToClipboard(shortUrl, link.id)}
                        className="text-gray-400 hover:text-indigo-600 transition"
                        title="Copy short link"
                      >
                        {copiedId === link.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-gray-400 text-xs mt-1 truncate max-w-xs">Destination: {link.destination_url}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${link.is_private ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {link.is_private ? <Lock size={10} /> : <Globe size={10} />}
                    {link.is_private ? 'Private' : 'Public'}
                  </div>
                  <a 
                    href={link.destination_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {links.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed rounded-lg bg-gray-50 text-gray-500 font-medium">
              No links yet. Add your first link to get started!
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Add New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Label (e.g., github, demo)</label>
                <input 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="github"
                  value={newLink.label}
                  onChange={(e) => setNewLink({...newLink, label: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination URL</label>
                <input 
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="https://github.com/username"
                  value={newLink.destination_url}
                  onChange={(e) => setNewLink({...newLink, destination_url: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <input 
                  type="checkbox"
                  id="is_private"
                  className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  checked={newLink.is_private}
                  onChange={(e) => setNewLink({...newLink, is_private: e.target.checked})}
                />
                <div className="flex flex-col">
                  <label htmlFor="is_private" className="text-sm font-bold text-gray-700 leading-none">Private Link</label>
                  <span className="text-xs text-gray-400 mt-1">Requires authentication to access</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition">Create Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
