export default function ProjectsPage() {
    return (
      <main className="min-h-screen bg-white text-black px-6 py-20">
        <h1 className="text-4xl font-bold mb-6">Explore Projects</h1>
        <p className="text-gray-700 max-w-2xl mb-8">
          Discover projects built at CoCreate Hub.  
          From startups to open-source collaborations, join the journey or support as an investor.
        </p>
  
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold mb-2">Krishi Setu</h3>
            <p className="text-gray-600">
              Connecting farmers & investors for sustainable agriculture.
            </p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-bold mb-2">Punya Path</h3>
            <p className="text-gray-600">
              Smart tourism app for devotees with AI trip planning & SOS safety.
            </p>
          </div>
        </div>
      </main>
    );
  }
  