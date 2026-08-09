export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
  color: string;
}

export interface District {
  id: string;
  name: string;
  city: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface Conquest {
  districtId: string;
  ownerId: PlayerId;
  score: number;
}

export interface QuizResult {
  districtId: string;
  score: number;
  total: number;
}
