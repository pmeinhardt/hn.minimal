type ID = number;
type Timestamp = number;

export type Ask = {
  by: string;
  descendants: number;
  id: ID;
  kids: ID[];
  score: number;
  text: string;
  time: Timestamp;
  title: string;
  type: "story";
};

export type Job = {
  by: string;
  id: ID;
  score: number;
  text: string;
  time: Timestamp;
  title: string;
  type: "job";
  url: string;
};

export type Poll = {
  by: string;
  descendants: number;
  id: ID;
  kids: ID[];
  parts: ID[];
  score: number;
  text: string;
  time: Timestamp;
  title: string;
  type: "poll";
};

export type Story = {
  by: string;
  descendants: number;
  id: ID;
  kids: ID[];
  score: number;
  time: Timestamp;
  title: string;
  type: "story";
  url: string;
};
