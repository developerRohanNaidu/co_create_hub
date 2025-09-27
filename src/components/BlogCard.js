import Image from "next/image";

export default function BlogCard({ blog }) {
  return (
    <div className="min-w-[250px] bg-gray-900 p-4 rounded-lg shadow hover:shadow-md">
      {blog.images?.[0] && (
        <Image
          src={blog.images[0].url}
          alt={blog.title}
          width={250}
          height={150}
          className="rounded-lg mb-2"
        />
      )}
      <h3 className="font-semibold">{blog.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-2">{blog.shortDescription}</p>
    </div>
  );
}
