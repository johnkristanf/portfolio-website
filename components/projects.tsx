export default function Projects() {
  const projects = [
    {
      name: "JoblyAI",
      description:
        "An AI-powered job portal that streamlines job recommendations and applications using machine learning, integrated with modern React UI and scalable backend.",
      image: "/img/projects/joblyai.png",
      alt: "JoblyAI Project",
      link: "https://jobly-ai-weld.vercel.app",
      documentation_link: "https://joblyai-documentation.vercel.app",
      technologies_used: [
        { name: "React", badge_color: "bg-blue-600" },
        { name: "Node.js", badge_color: "bg-green-600" },
        { name: "Express", badge_color: "bg-gray-700" },
        { name: "PostgreSQL", badge_color: "bg-blue-700" },
        { name: "OpenAI", badge_color: "bg-green-800" },
      ],
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-900 to-black">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-5xl font-bold text-center mb-16 gradient-text">
                        Featured Projects
                    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    
      {projects && projects.length > 0 && projects.map((project, idx) => (
        <div className="glass-effect rounded-2xl overflow-hidden tech-card" key={idx}>
          <div className="h-52 flex items-center justify-center">
            <img
              src={project.image}
              alt={project.alt}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 text-violet-400">
              {project.name}
            </h3>
            <p className="text-gray-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies_used.map((tech, i) => (
                <span
                  key={tech.name + i}
                  className={`px-3 py-1 ${tech.badge_color} rounded-full text-xs`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3 mt-5">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 font-semibold"
              >
                View Project &rarr;
              </a>
              {project.documentation_link && (
                <a
                  href={project.documentation_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  View Documentation &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
    </section>
  );
}