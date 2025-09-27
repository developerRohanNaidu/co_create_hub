export default function ProfileStats({ projects, blogs, followersCount, followingCount }) {
    return (
      <div className="flex gap-6 text-center">
        <div>
          <p className="font-bold">{projects.length}</p>
          <p className="text-gray-400">Projects</p>
        </div>
        <div>
          <p className="font-bold">{blogs.length}</p>
          <p className="text-gray-400">Blogs</p>
        </div>
        <div>
          <p className="font-bold">{followersCount || 0}</p>
          <p className="text-gray-400">Followers</p>
        </div>
        <div>
          <p className="font-bold">{followingCount || 0}</p>
          <p className="text-gray-400">Following</p>
        </div>
      </div>
    );
  }
  