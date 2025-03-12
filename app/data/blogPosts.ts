export interface BlogPost {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
  }
  
  export const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Ultimate Cigar Selection Guide",
      description: "Learn how to choose the perfect cigar for any occasion. Discover the nuances of flavor profiles and find your ideal strength level.",
      image: "https://lh3.googleusercontent.com/d/1y2gCHg4Zk3tL7czbOgdYWd3FrU6O5lbi",
      link: "#"
    },
    {
      id: 2,
      title: "Mastering the Art of Cigar Cutting",
      description: "Explore the various techniques of cigar cutting and understand how each method can enhance your overall smoking experience.",
      image: "https://lh3.googleusercontent.com/d/10zRGI22OwEDODlxAOcb9IIwtJxD6_fxz",
      link: "#"
    },
    {
      id: 3,
      title: "Essential Humidor Maintenance",
      description: "Master the art of maintaining the perfect environment for your cigars. Learn expert techniques for humidity control and proper storage.",
      image: "https://lh3.googleusercontent.com/d/12Fu0Mopw_V_alNKXFgAUg_YGLbyOMVLD",
      link: "#"
    }
  ];