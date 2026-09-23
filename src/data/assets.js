const grade1English = (path) => new URL(`../../assets/GRADE 1/english game/${path}`, import.meta.url).href;

const generated = {
  watermelon: grade1English("generated/watermelon.webp"),
  rose: grade1English("generated/rose.webp"),
  jasmine: grade1English("generated/jasmine.webp"),
  marigold: grade1English("generated/marigold.webp"),
};

const levelArt = {
  level1: {
    apple: "level 1/apple (1).webp", brinjal: "level 1/brinjal  (1).webp",
    cabbage: "level 1/cabbage (1) (1).webp", carrot: "level 1/carrot (1) (1).webp",
    mango: "level 1/mango (1).webp", orange: "level 1/orange.webp",
    pineapple: "level 1/pineapple (1).webp", potato: "level 1/potato (1).webp",
    tomato: "level 1/tomato (1) (1).webp",
  },
  level2: {
    apple: "level 2/apple (1).webp", banana: "level 2/banana (1).webp",
    cabbage: "level 2/cabbage (1) (1).webp", capsicum: "level 2/capsicum (1) (1).webp",
    chilli: "level 2/chilli (1).webp", guava: "level 2/guava (1) (1).webp",
    lemon: "level 2/lemon (1) (1).webp", mango: "level 2/mango (1).webp",
    peas: "level 2/peas (1) (1).webp", tomato: "level 2/tomato (1) (1).webp",
  },
  level3: {
    apple: "level 3/apple (1).webp", brinjal: "level 3/brinjal  (1).webp",
    cabbage: "level 3/cabbage (1) (1).webp", carrot: "level 3/carrot (1) (1).webp",
    mango: "level 3/mango (1).webp", orange: "level 3/orange.webp",
    pineapple: "level 3/pineapple (1).webp", potato: "level 3/potato (1).webp",
  },
};

const mathByLevel = Object.fromEntries(Object.entries(levelArt).map(([level, entries]) => [
  level,
  { ...Object.fromEntries(Object.entries(entries).map(([key, path]) => [key, grade1English(path)])), ...generated },
]));

export function resolveMathArt(artId, assetSet) {
  return mathByLevel?.[assetSet]?.[artId] ?? generated[artId] ?? mathByLevel.level1.apple;
}

export const assets = {
  characters: {
    idle: "assets/characters/idle.webp",
    presentation: "assets/characters/final_presentation_clean.webp",
    correct: "assets/characters/modified_thubms_up.webp",
    nod: "assets/characters/updated_nod.webp",
    happy: "assets/characters/happy.webp",
    thinking: "assets/characters/thinking.webp",
    surprised: "assets/characters/surprised.webp",
    successDance: "assets/characters/moon_walk_normalized.webp",
  },
  backgrounds: {},
  items: { math: mathByLevel.level1, mathByLevel },
  ui: {
    success: [
      "assets/ui/start-background.webp",
      "assets/ui/image 18.webp",
      "assets/ui/success-star-1.webp",
      "assets/ui/success-star-2.webp",
      "assets/ui/success-star-3.webp",
    ],
    conveyorRims: "assets/ui/conveyor-rims.webp",
    conveyorFrame: "assets/ui/conveyor-frame.webp",
    conveyorTrackMask: "assets/ui/conveyor-track.webp",
    sortingBins: {
      fruit: "assets/ui/market-bins/fruit.webp",
      vegetable: "assets/ui/market-bins/vegetable.webp",
      red: "assets/ui/market-bins/red.webp",
      yellow: "assets/ui/market-bins/yellow.webp",
      green: "assets/ui/market-bins/green.webp",
      fruits: "assets/ui/market-bins/fruits.webp",
      vegetables: "assets/ui/market-bins/vegetables.webp",
      flowers: "assets/ui/market-bins/flowers.webp",
    },
    boxLeaves: "assets/ui/ui-box-leaves.webp",
  },
  audio: {},
  fx: {},
};

const imageRequests = new Map();
const decodedImages = new Map();
const DECODED_IMAGE_LIMIT = 64;

function retainDecodedImage(src, image) {
  decodedImages.delete(src);
  decodedImages.set(src, image);
  while (decodedImages.size > DECODED_IMAGE_LIMIT) {
    decodedImages.delete(decodedImages.keys().next().value);
  }
}

export function preloadImage(src) {
  if (!src) return Promise.resolve();
  if (imageRequests.has(src)) {
    const decoded = decodedImages.get(src);
    if (decoded) retainDecodedImage(src, decoded);
    return imageRequests.get(src);
  }
  const request = new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      await image.decode?.().catch(() => {});
      retainDecodedImage(src, image);
      resolve({ src, loaded: true });
    };
    image.onerror = () => resolve({ src, loaded: false });
    image.src = src;
  });
  imageRequests.set(src, request);
  return request;
}

export function hydrateDeferredImages(root = document) {
  const images = [...root.querySelectorAll("img[data-src]")];
  return Promise.all(images.map((image) => {
    const src = image.dataset.src;
    delete image.dataset.src;
    image.src = src;
    return image.decode?.().catch(() => {}) ?? preloadImage(src);
  }));
}

export function preloadLevelAssets(level) {
  if (!level) return Promise.resolve([]);
  const urls = new Set([
    assets.ui.boxLeaves,
    ...level.items.map((entry) => resolveMathArt(entry.art, entry.assetSet)),
    ...level.bins.flatMap((entry) => [
      resolveMathArt(entry.art, entry.assetSet),
      assets.ui.sortingBins[entry.id] ?? assets.ui.sortingBins.fruit,
    ]),
  ]);
  return Promise.all([...urls].map(preloadImage));
}
