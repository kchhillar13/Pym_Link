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

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Deep Space Canvas */}
      <div className="space-canvas" />
      <div className="mesh-pattern" />

      <header className="px-6 h-20 flex items-center gap-4 z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Link href="/dashboard" className="text-grey-blue hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-white glow-text-lavender">{project?.title || 'Project Links'}</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-12 w-full z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight glow-text-lavender">Links</h2>
            <p className="text-grey-blue text-sm mt-1">Manage your short links for <strong className="text-white/80">{project?.slug}</strong></p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex h-11 items-center justify-center px-6 rounded-lg btn-gradient text-sm font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all gap-2"
          >
            <Plus size={18} /> Add Link
          </button>
        </div>

        <div className="space-y-4">
          {links.map((link) => {
            const shortUrl = `${BACKEND_URL}/${user?.username}/${project?.slug}/${link.label}`;
            return (
              <div key={link.id} className="bg-white/5 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-500/30 transition-all">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 bg-white/5 text-purple-400 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                    <LinkIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-lg">{link.label}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-muted-lavender truncate max-w-[200px] md:max-w-xs">{shortUrl}</span>
                      <button 
                        onClick={() => copyToClipboard(shortUrl, link.id)}
                        className="text-grey-blue hover:text-white transition-colors"
                        title="Copy short link"
                      >
                        {copiedId === link.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-grey-blue text-xs mt-1 truncate max-w-xs">Destination: <span className="text-white/60">{link.destination_url}</span></p>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 border-t border-white/5 md:border-t-0 pt-3 md:pt-0">
                  <div className={`flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md ${link.is_private ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'}`}>
                    {link.is_private ? <Lock size={10} /> : <Globe size={10} />}
                    {link.is_private ? 'Private' : 'Public'}
                  </div>
                  <a 
                    href={link.destination_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-grey-blue hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button 
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
          {links.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/2 backdrop-blur-sm">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-white/5 rounded-full">
                  <LinkIcon size={32} className="text-white/20" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No links yet</h3>
              <p className="text-grey-blue text-sm font-medium">Add your first short link to get started.</p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 glow-text-lavender text-center">Add New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-grey-blue mb-2">Label (e.g., github, demo)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
                  placeholder="github"
                  value={newLink.label}
                  onChange={(e) => setNewLink({...newLink, label: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-blue mb-2">Destination URL</label>
                <input 
                  type="url"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
                  placeholder="https://github.com/username"
                  value={newLink.destination_url}
                  onChange={(e) => setNewLink({...newLink, destination_url: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                <input 
                  type="checkbox"
                  id="is_private"
                  className="w-5 h-5 accent-purple-600 rounded border-white/20 bg-black/20"
                  checked={newLink.is_private}
                  onChange={(e) => setNewLink({...newLink, is_private: e.target.checked})}
                />
                <div className="flex flex-col">
                  <label htmlFor="is_private" className="text-sm font-bold text-white leading-none cursor-pointer">Private Link</label>
                  <span className="text-xs text-grey-blue mt-1">Requires authentication to access</span>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-grey-blue font-bold hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-lg btn-gradient font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
                >
                  Create Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
