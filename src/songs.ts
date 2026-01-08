export type Slot = {
  id: number;
  name: string;
  artist: string;
  src?: string;
};

export const songs = [
  {
    id: 100,
    name: "Don't Tell Me I'm Wrong",
    artist: "Cindy Lee",
    src: "cindy-lee_dont-tell-me-im-wrong.mp3",
  },
  {
    id: 101,
    name: "12th Street Rag – Fox trot",
    artist: "All Star Trio",
    src: "all-star-trio_12th-street-rag.mp3",
  },
  {
    id: 102,
    name: "Trapped",
    artist: "Boards of Canada",
    src: "boc-trapped.mp3",
  },
  {
    id: 115,
    name: "Doorbell",
    artist: "Doors (the object)",
    src: "doorbell.mp3",
  },
] as const satisfies Slot[];
