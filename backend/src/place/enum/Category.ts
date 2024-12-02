export enum Category {
  맛집 = '맛집',
  명소 = '명소',
  카페 = '카페',
  숙소 = '숙소',
  기타 = '기타',
}

const categoryMapping: Record<Category, string[]> = {
  [Category.맛집]: ['restaurant', 'food', 'meal_takeaway', 'bakery'],
  [Category.명소]: [
    'tourist_attraction',
    'museum',
    'park',
    'zoo',
    'art_gallery',
  ],
  [Category.카페]: ['cafe', 'bar', 'coffee_shop', 'tea_house'],
  [Category.숙소]: [
    'lodging',
    'hotel',
    'motel',
    'guest_house',
    'bed_and_breakfast',
  ],
  [Category.기타]: [],
};

export function mapCategory(types: string[]): Category {
  if (!types || types.length === 0) return null;

  for (const [category, keywords] of Object.entries(categoryMapping)) {
    if (keywords.some((type: string) => types.includes(type))) {
      return category as Category;
    }
  }
  return Category.기타;
}
