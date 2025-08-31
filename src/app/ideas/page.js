export default function IdeasPage() {
    return (
      <main className="min-h-screen bg-white text-black px-6 py-20">
        <h1 className="text-4xl font-bold mb-6">Share Your Idea</h1>
        <p className="text-gray-700 max-w-2xl mb-8">
          Got an innovative idea? Share it with the CoCreate Hub community.  
          Connect with developers, mentors, and investors who can help bring it to life.
        </p>
  
        <form className="max-w-2xl space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-lg px-4 py-2"
          />
          <textarea
            placeholder="Describe your idea..."
            rows="5"
            className="w-full border rounded-lg px-4 py-2"
          />
          <button className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800">
            Submit Idea
          </button>
        </form>
      </main>
    );
  }
  