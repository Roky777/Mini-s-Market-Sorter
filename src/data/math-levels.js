const item = (name, art, answer) => ({ name, art, answer });

const LEVELS = [
  {
    title: "Fruit or Vegetable?",
    instruction: "Sort by everyday food use: fruit or vegetable.",
    showNames: true,
    maxOnBelt: 3,
    beltTravelRate: 0.08,
    bins: [
      { id: "fruit", label: "Fruit", art: "apple" },
      { id: "vegetable", label: "Vegetable", art: "carrot" },
    ],
    items: [
      item("Mango", "mango", "fruit"), item("Apple", "apple", "fruit"),
      item("Orange", "orange", "fruit"), item("Pineapple", "pineapple", "fruit"),
      item("Watermelon", "watermelon", "fruit"), item("Tomato", "tomato", "vegetable"),
      item("Potato", "potato", "vegetable"), item("Carrot", "carrot", "vegetable"),
      item("Brinjal", "brinjal", "vegetable"), item("Cabbage", "cabbage", "vegetable"),
    ],
  },
  {
    title: "Colour Basket Sort",
    instruction: "Sort each picture by its colour.",
    showNames: false,
    maxOnBelt: 4,
    beltTravelRate: 0.076,
    bins: [
      { id: "red", label: "Red", art: "apple" },
      { id: "yellow", label: "Yellow", art: "mango" },
      { id: "green", label: "Green", art: "guava" },
    ],
    items: [
      item("Red apple", "apple", "red"), item("Red tomato", "tomato", "red"),
      item("Red chilli", "chilli", "red"), item("Yellow mango", "mango", "yellow"),
      item("Yellow banana", "banana", "yellow"), item("Yellow lemon", "lemon", "yellow"),
      item("Green guava", "guava", "green"), item("Green peas", "peas", "green"),
      item("Green cabbage", "cabbage", "green"), item("Green capsicum", "capsicum", "green"),
    ],
  },
  {
    title: "Market Categories",
    instruction: "Sort fruits, vegetables, and flowers.",
    showNames: true,
    maxOnBelt: 4,
    beltTravelRate: 0.076,
    bins: [
      { id: "fruits", label: "Fruits", art: "apple" },
      { id: "vegetables", label: "Vegetables", art: "carrot" },
      { id: "flowers", label: "Flowers", art: "rose" },
    ],
    items: [
      item("Apple", "apple", "fruits"), item("Orange", "orange", "fruits"),
      item("Pineapple", "pineapple", "fruits"), item("Mango", "mango", "fruits"),
      item("Potato", "potato", "vegetables"), item("Brinjal", "brinjal", "vegetables"),
      item("Carrot", "carrot", "vegetables"), item("Cabbage", "cabbage", "vegetables"),
      item("Rose", "rose", "flowers"), item("Jasmine", "jasmine", "flowers"),
      item("Marigold", "marigold", "flowers"),
    ],
  },
];

function buildTutorial(level, levelIndex) {
  const examples = level.bins.map((bin) => level.items.find((entry) => entry.answer === bin.id)).filter(Boolean);
  const demonstration = examples[0] ?? level.items[0];
  const interactive = examples[1] ?? level.items[1] ?? demonstration;
  const labelFor = (entry) => level.bins.find((bin) => bin.id === entry.answer)?.label ?? entry.answer;
  return {
    concept: level.title,
    intro: level.instruction,
    mandatory: levelIndex === 0,
    steps: [
      { type: "concept", instruction: level.instruction },
      { type: "demonstration", objectName: demonstration.name, instruction: `${demonstration.name} → ${labelFor(demonstration)}` },
      { type: "interactive", objectName: interactive.name, instruction: `Sort ${interactive.name}!`, allowHints: true },
      { type: "completion", instruction: "You're ready!" },
    ],
  };
}

export const MATH_LEVELS = LEVELS.map((level, index) => ({
  ...level,
  goal: level.items.length,
  requiredCorrectPerItem: 1,
  assetSet: `level${index + 1}`,
  bins: level.bins.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })),
  items: level.items.map((entry) => ({ ...entry, assetSet: `level${index + 1}` })),
  tutorial: buildTutorial(level, index),
}));

export const getLevel = (index) => MATH_LEVELS[index];
