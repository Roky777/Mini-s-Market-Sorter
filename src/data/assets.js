const grade1English = (path) => new URL(`../../assets/GRADE 1/english game/${path}`, import.meta.url).href;

const generated = {
  watermelon: grade1English("generated/watermelon.png"),
  rose: grade1English("generated/rose.png"),
  jasmine: grade1English("generated/jasmine.png"),
  marigold: grade1English("generated/marigold.png"),
};

const levelArt = {
  level1: {
    apple: "level 1/apple (1).png", brinjal: "level 1/brinjal  (1).png",
    cabbage: "level 1/cabbage (1) (1).png", carrot: "level 1/carrot (1) (1).png",
    mango: "level 1/mango (1).png", orange: "level 1/orange.png",
    pineapple: "level 1/pineapple (1).png", potato: "level 1/potato (1).png",
    tomato: "level 1/tomato (1) (1).png",
  },
  level2: {
    apple: "level 2/apple (1).png", banana: "level 2/banana (1).png",
    cabbage: "level 2/cabbage (1) (1).png", capsicum: "level 2/capsicum (1) (1).png",
    chilli: "level 2/chilli (1).png", guava: "level 2/guava (1) (1).png",
    lemon: "level 2/lemon (1) (1).png", mango: "level 2/mango (1).png",
    peas: "level 2/peas (1) (1).png", tomato: "level 2/tomato (1) (1).png",
  },
  level3: {
    apple: "level 3/apple (1).png", brinjal: "level 3/brinjal  (1).png",
    cabbage: "level 3/cabbage (1) (1).png", carrot: "level 3/carrot (1) (1).png",
    mango: "level 3/mango (1).png", orange: "level 3/orange.png",
    pineapple: "level 3/pineapple (1).png", potato: "level 3/potato (1).png",
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
    idle: "assets/characters/idle.png",
    presentation: "assets/characters/final_presentation_clean.png",
  },
  backgrounds: {},
  items: { math: mathByLevel.level1, mathByLevel },
  ui: {
    conveyorRims: "assets/ui/conveyor-rims.png",
    conveyorFrame: "assets/ui/conveyor-frame.png",
    conveyorTrackMask: "assets/ui/conveyor-track.png",
    sortingBins: {
      fruit: "assets/ui/market-bins/fruit.png",
      vegetable: "assets/ui/market-bins/vegetable.png",
      red: "assets/ui/market-bins/red.png",
      yellow: "assets/ui/market-bins/yellow.png",
      green: "assets/ui/market-bins/green.png",
      fruits: "assets/ui/market-bins/fruits.png",
      vegetables: "assets/ui/market-bins/vegetables.png",
      flowers: "assets/ui/market-bins/flowers.png",
    },
    boxLeaves: "assets/ui/ui-box-leaves.png",
  },
  audio: {},
  fx: {},
};

const imageRequests = new Map();

export function preloadImage(src) {
  if (!src) return Promise.resolve();
  if (imageRequests.has(src)) return imageRequests.get(src);
  const request = new Promise((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = async () => {
      await image.decode?.().catch(() => {});
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
