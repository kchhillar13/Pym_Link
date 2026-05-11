import api from '@/lib/api';
import { ExternalLink, Globe, Lock } from 'lucide-react';

interface Link {
  id: string;
  label: string;
  destination_url: string;
  is_private: boolean;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  links: Link[];
}

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = params;
  let projects: Project[] = [];
  let error = null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    console.log(`Fetching public profile from: ${apiUrl}/api/public/${username}`);
    
    const response = await fetch(`${apiUrl}/api/public/${username}`, {
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      projects = await response.json();
    } else {
      const errorText = await response.text();
      console.error(`API Error (${response.status}): ${errorText}`);
      error = `User not found or profile is private (Status: ${response.status})`;
    }
  } catch (err: any) {
    console.error('Fetch error:', err.message);
    error = `Failed to load profile: ${err.message}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold uppercase">
            {username[0]}
          </div>
          <h1 className="text-3xl font-bold">@{username}</h1>
          <p className="text-gray-500 mt-2">Check out my projects and links</p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-center border border-red-100">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                <p className="text-gray-600 text-sm mb-6">{project.description}</p>
                <div className="grid grid-cols-1 gap-3">
                  {project.links.filter(l => !l.is_private).map((link) => (
                    <a
                      key={link.id}
                      href={link.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-lg group transition-colors border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={18} className="text-indigo-500" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-indigo-600" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-10 text-gray-500 italic">
                No public projects to show.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
