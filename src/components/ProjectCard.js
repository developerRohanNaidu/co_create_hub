import Image from "next/image";

export default function ProjectCard({ project }) {
  return (
    <div className="min-w-[250px] bg-gray-900 p-4 rounded-lg shadow hover:shadow-md">
      {project.images?.[0] && (
        <Image
          src={project.images[0].url}
          alt={project.title}
          width={250}
          height={150}
          className="rounded-lg mb-2"
        />
      )}
      <h3 className="font-semibold">{project.title}</h3>
      <p className="text-gray-400 text-sm">
        Likes: {project.likeCount} | Comments: {project.commentCount}
      </p>
    </div>
  );
}
