import { ReactNode } from 'react';

export interface Scenario {
  optionA: string;
  optionB: string;
  percentageA: number;
  percentageB: number;
  commentary: string;
}

export type ViewState = 'home' | 'would-you-rather' | 'connect-4' | 'random-facts';

export interface GameCardProps {
  id: ViewState;
  title: string;
  description: string;
  color: string;
  icon: ReactNode;
  onClick: (id: ViewState) => void;
}

export type ScenarioCategory = 'General' | 'Divertidas' | 'Difíciles' | 'Asquerosas' | 'Filosóficas' | 'Absurdas' | 'Curiosas' | 'Extremas';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Fact {
  topic: string;
  content: string;
}
