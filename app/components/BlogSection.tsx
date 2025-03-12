import BlogCard from './BlogCard'
import { blogPosts } from '../data/blogPosts'

export default function BlogSection() {
  return (
    <section className="blog">
      <div className="container">
        <h2>Cigar Enthusiast Blog</h2>
        <p>Insights, tips, and stories from the world of premium cigars</p>
        
        <div className="blog-grid">
          {blogPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}