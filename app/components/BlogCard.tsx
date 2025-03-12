import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '../data/blogPosts'

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="blog-card">
      <Image 
        src={post.image}
        alt={post.title}
        width={300}
        height={150}
        className="blog-image"
        loading="lazy"
      />
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <Link href={post.link} className="read-more">
        Read More
      </Link>
    </div>
  );
}