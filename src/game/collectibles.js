import catalog from '../assets/collectibles.json';

export const COLLECTIBLES = catalog;

export function idAt(index) {
  if (index < 24) return COLLECTIBLES[index].id;
  return COLLECTIBLES[index % 6].id;
}

export function awardCollectible(collection) {
  if (collection.nextIndex < 24) {
    collection.unlockedIds.push(COLLECTIBLES[collection.nextIndex].id);
  }
  collection.nextIndex += 1;
  return collection;
}

export function overlayStamp(collection) {
  if (collection.nextIndex < 24) return null;
  return idAt(collection.nextIndex - 1);
}
