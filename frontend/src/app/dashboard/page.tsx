"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Link as LinkIcon, Lock, Globe, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  _count: {
    links: number;
  };
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ slug: '', title: '', description: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects');
      setProjects(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/projects', newProject);
      setShowModal(false);
      setNewProject({ slug: '', title: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert('Error creating project');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Deep Space Canvas */}
      <div className="space-canvas" />
      <div className="mesh-pattern" />

      <header className="px-6 h-20 flex items-center justify-between z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <span className="text-2xl font-bold tracking-tight glow-text-purple">Pym-Link</span>
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-grey-blue">
            <span className="text-white/50">Welcome,</span> {user?.username}
          </span>
          <button 
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-sm font-semibold text-red-400/80 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 w-full z-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight glow-text-lavender">My Projects</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex h-11 items-center justify-center px-6 rounded-lg btn-gradient text-sm font-semibold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all gap-2"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl hover:border-purple-500/30 transition-all hover:translate-y-[-4px]">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors">{project.title}</h3>
                <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md text-grey-blue font-bold">
                  {project.slug}
                </span>
              </div>
              <p className="text-grey-blue text-sm mb-6 line-clamp-2 h-10">{project.description}</p>
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <span className="text-xs text-white/40 flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-purple-400/60" /> 
                  <span className="text-white/60 font-medium">{project._count.links}</span> links
                </span>
                <Link 
                  href={`/dashboard/${project.id}`}
                  className="text-sm font-bold text-muted-lavender hover:text-white transition-colors flex items-center gap-1"
                >
                  Manage <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/2 backdrop-blur-sm">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-white/5 rounded-full">
                  <LinkIcon size={32} className="text-white/20" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
              <p className="text-grey-blue text-sm max-w-xs mx-auto">
                Create your first project to start organizing and securing your project links.
              </p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 glow-text-lavender text-center">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-grey-blue mb-2">Slug (Project Identifier)</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
                  placeholder="e.g. portfolio-2026"
                  value={newProject.slug}
                  onChange={(e) => setNewProject({...newProject, slug: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-blue mb-2">Project Title</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20"
                  placeholder="My Creative Portfolio"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-grey-blue mb-2">Description</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20 h-24 resize-none"
                  placeholder="Describe your project links..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
