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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-indigo-600">Pym-Link</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">{user?.username}</span>
          <button 
            onClick={() => { localStorage.clear(); router.push('/login'); }}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Projects</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{project.title}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{project.slug}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <LinkIcon size={14} /> {project._count.links} links
                </span>
                <Link 
                  href={`/dashboard/${project.id}`}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Manage Links
                </Link>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-lg bg-gray-50 text-gray-500">
              No projects yet. Create your first one to get started!
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Slug (e.g., p-1)</label>
                <input 
                  className="w-full border rounded-md px-3 py-2"
                  value={newProject.slug}
                  onChange={(e) => setNewProject({...newProject, slug: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input 
                  className="w-full border rounded-md px-3 py-2"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-md px-3 py-2"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-600">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
