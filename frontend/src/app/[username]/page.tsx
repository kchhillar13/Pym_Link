import api from '@/lib/api';
import { ExternalLink, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

interface LinkType {
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
  links: LinkType[];
}

export default async function PublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
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
    <div className="relative min-h-screen flex flex-col py-12 px-4 z-0">
      {/* Deep Space Canvas */}
      <div className="space-canvas" />
      <div className="mesh-pattern" />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full px-6 h-20 flex items-center justify-between z-10">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <span className="text-2xl font-bold tracking-tight glow-text-purple">Pym-Link</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full z-10 pt-16">
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-white/5 border border-white/10 text-purple-400 shadow-[0_0_30px_rgba(147,51,234,0.3)] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl font-bold uppercase backdrop-blur-md">
            {username[0]}
          </div>
          <h1 className="text-4xl font-bold text-white glow-text-lavender">@{username}</h1>
          <p className="text-grey-blue mt-3 text-lg">Check out my projects and links</p>
        </div>

        {error ? (
          <div className="bg-red-500/10 text-red-400 p-6 rounded-xl text-center border border-red-500/20 backdrop-blur-md">
            {error}
          </div>
        ) : (
          <div className="space-y-10">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 hover:border-purple-500/30 transition-all">
                <h2 className="text-2xl font-bold mb-3 text-white">{project.title}</h2>
                <p className="text-grey-blue text-base mb-8">{project.description}</p>
                <div className="grid grid-cols-1 gap-4">
                  {project.links.filter(l => !l.is_private).map((link) => (
                    <a
                      key={link.id}
                      href={link.destination_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex justify-between items-center p-5 bg-white/5 hover:bg-white/10 rounded-xl group transition-all border border-white/5 hover:border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <Globe size={20} className="text-purple-400/80" />
                        <span className="font-bold text-white text-lg tracking-wide">{link.label}</span>
                      </div>
                      <ExternalLink size={18} className="text-grey-blue group-hover:text-white transition-colors" />
                    </a>
                  ))}
                  {project.links.filter(l => !l.is_private).length === 0 && (
                     <div className="text-center py-6 text-white/40 italic bg-white/2 rounded-lg border border-white/5">
                       No public links available.
                     </div>
                  )}
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-16 text-grey-blue border border-dashed border-white/10 rounded-2xl bg-white/2 backdrop-blur-sm">
                No public projects to show yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
