/**
 * Unified listings source for the buyer portal.
 * Reads from farmerListingsStore so anything a farmer adds/edits
 * is immediately visible to buyers.
 *
 * The static `Listing` type is kept for backward-compat with
 * ListingDetails / QualityVerification which need extra fields
 * (farmerPhone, farmerWhatsApp, etc.). We merge those from the
 * store's FarmerListing, falling back to sensible defaults.
 */

import { farmerListingsStore, type FarmerListing } from './farmerListingsStore';

export interface Listing {
  id: number;
  name: string;
  variety: string;
  grade: string;
  price: number;
  unit: string;
  qty: string;
  farmer: string;
  farmerOwner: string;
  farmerPhone: string;
  farmerWhatsApp: string;
  farmerAvatar: string;
  farmerJoined: string;
  farmerSales: string;
  farmerRating: number;
  farmerReviews: number;
  farmerVerified: boolean;
  location: string;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  img: string;
  images: string[];
  verified: boolean;
  fresh: string;
  harvestDate: string;
  description: string;
  tags: string[];
  batchId: string;
  certifications: string[];
}

// Extra metadata keyed by listing id (for fields the farmer store doesn't have)
const META: Record<number, Partial<Listing>> = {
  1: { farmerPhone: '+919876543210', farmerWhatsApp: '919876543210', farmerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', farmerJoined: 'Jan 2022', farmerSales: '2,400 kg sold', farmerRating: 4.8, farmerReviews: 124, farmerVerified: true, lat: 20.0059, lng: 73.7897, rating: 4.8, reviews: 124, certifications: ['Organic Certified', 'Pesticide-Free', 'AgriLink Verified'] },
  2: { farmerPhone: '+919823456789', farmerWhatsApp: '919823456789', farmerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', farmerJoined: 'Mar 2021', farmerSales: '5,100 kg sold', farmerRating: 4.6, farmerReviews: 89,  farmerVerified: true, lat: 18.5204, lng: 73.8567, rating: 4.6, reviews: 89,  certifications: ['AgriLink Verified'] },
  3: { farmerPhone: '+919765432109', farmerWhatsApp: '919765432109', farmerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', farmerJoined: 'Jun 2020', farmerSales: '3,800 kg sold', farmerRating: 4.9, farmerReviews: 210, farmerVerified: true, lat: 20.0059, lng: 73.7897, rating: 4.9, reviews: 210, certifications: ['Grade A Certified', 'AgriLink Verified'] },
  4: { farmerPhone: '+919654321098', farmerWhatsApp: '919654321098', farmerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80', farmerJoined: 'Sep 2022', farmerSales: '1,200 kg sold', farmerRating: 4.7, farmerReviews: 67,  farmerVerified: false, lat: 17.6868, lng: 75.9064, rating: 4.7, reviews: 67,  certifications: [] },
  5: { farmerPhone: '+919543210987', farmerWhatsApp: '919543210987', farmerAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', farmerJoined: 'Nov 2021', farmerSales: '800 kg sold',   farmerRating: 4.5, farmerReviews: 43,  farmerVerified: true, lat: 16.8524, lng: 74.5815, rating: 4.5, reviews: 43,  certifications: ['Organic Certified', 'AgriLink Verified'] },
  6: { farmerPhone: '+919432109876', farmerWhatsApp: '919432109876', farmerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80', farmerJoined: 'Feb 2020', farmerSales: '2,100 kg sold', farmerRating: 5.0, farmerReviews: 156, farmerVerified: true, lat: 21.1458, lng: 79.0882, rating: 5.0, reviews: 156, certifications: ['AgriLink Verified'] },
};

/** Convert a FarmerListing → buyer-facing Listing */
function toListing(fl: FarmerListing): Listing {
  const meta = META[fl.id] || {};
  return {
    id:             fl.id,
    name:           fl.name,
    variety:        fl.variety,
    grade:          fl.grade,
    price:          fl.price,
    unit:           fl.unit,
    qty:            `${fl.qty} ${fl.unit}`,
    farmer:         'AgriLink Farmer',
    farmerOwner:    'Farmer',
    farmerPhone:    '+919800000000',
    farmerWhatsApp: '919800000000',
    farmerAvatar:   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    farmerJoined:   fl.createdAt,
    farmerSales:    `${fl.views} views`,
    farmerRating:   4.5,
    farmerReviews:  fl.views,
    farmerVerified: fl.status === 'Active',
    location:       fl.location || 'Africa',
    lat:            0,
    lng:            0,
    rating:         4.5,
    reviews:        fl.views,
    img:            fl.img,
    images:         fl.images.length > 0 ? fl.images : [fl.img],
    verified:       fl.status === 'Active',
    fresh:          fl.harvestDate ? `Harvested ${fl.harvestDate}` : 'Fresh',
    harvestDate:    fl.harvestDate,
    description:    fl.description,
    tags:           [fl.grade, fl.variety].filter(Boolean),
    batchId:        fl.batchId,
    certifications: fl.status === 'Active' ? ['AgriLink Verified'] : [],
    // override with known metadata if available
    ...meta,
  };
}

/**
 * Live listings — only Active ones visible to buyers.
 * Call this function (don't cache the result) so it always
 * reflects the latest store state.
 */
export const getListings = (): Listing[] =>
  farmerListingsStore.getAll()
    .filter(l => l.status === 'Active')
    .map(toListing);

/**
 * Get a single listing by id (any status, for detail page).
 */
export const getListingById = (id: number): Listing | undefined => {
  const fl = farmerListingsStore.getById(id);
  return fl ? toListing(fl) : undefined;
};

/**
 * Legacy named export — static snapshot used by files that
 * imported `listings` directly. Points to the live store.
 * Prefer getListings() in new code.
 */
export const listings: Listing[] = new Proxy([] as Listing[], {
  get(_, prop) {
    const live = getListings();
    if (prop === 'length') return live.length;
    if (prop === Symbol.iterator) return live[Symbol.iterator].bind(live);
    if (prop === 'filter') return live.filter.bind(live);
    if (prop === 'map') return live.map.bind(live);
    if (prop === 'find') return live.find.bind(live);
    if (prop === 'slice') return live.slice.bind(live);
    if (prop === 'forEach') return live.forEach.bind(live);
    if (typeof prop === 'string' && !isNaN(Number(prop))) return live[Number(prop)];
    return (live as never)[prop as never];
  },
});
