export interface ImageCandidate {
  url: string;
  source: string;
}

export interface ExtractImagesResponse {
  images: ImageCandidate[];
  title: string;
  description: string;
}

export interface HotpepperShop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  url: string;
  photoL?: string;
};