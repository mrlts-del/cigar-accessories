export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
  }
  
  export const products: Product[] = [
    {
      id: 1,
      title: "Precision Cigar Cutter",
      description: "Premium stainless steel cutter",
      price: 89.99,
      image: "https://lh3.googleusercontent.com/d/1BiSaLxuEHWlMgckLh2Y-9UfTlmXIQgaD"
    },
    {
      id: 2,
      title: "Luxury Humidor",
      description: "Cedar-lined storage case",
      price: 199.99,
      image: "https://lh3.googleusercontent.com/d/1P6jI2MFYqZiSYQ9t4w-6pzNIXWFQiAyI"
    },
    {
      id: 3,
      title: "Torch Lighter",
      description: "Triple flame butane lighter",
      price: 69.99,
      image: "https://lh3.googleusercontent.com/d/1WpOwglfLZflOeWlJxwOBw9b8KELeVFDl"
    },
    {
      id: 4,
      title: "Travel Case",
      description: "Leather 5-cigar travel case",
      price: 129.99,
      image: "https://lh3.googleusercontent.com/d/1S8wPM-a739IYo3vBS2jAVrttNtdiEuey"
    },
    {
      id: 5,
      title: "Ashtray Set",
      description: "Crystal ashtray with accessories",
      price: 149.99,
      image: "https://lh3.googleusercontent.com/d/14i0c_1CsCn0-NgJXsOY_sBRnrTbG85b0"
    },
    {
      id: 6,
      title: "Cigar Punch",
      description: "Keychain bullet punch",
      price: 39.99,
      image: "https://lh3.googleusercontent.com/d/1WCCcLfoaWORMnNoCWoyCLQc3BVRXhfYM"
    }
  ];