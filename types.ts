export type FrictionModel = 'kv' | 'kv2';

export interface SimulationParams {
  mass: number;
  frictionCoefficient: number;
  volume: number;
  airDensity: number;
  simulationHeight: number;
  frictionModel: FrictionModel;
  gravity: number;
  initialVelocity: number;
}

export interface SimulationHistoryPoint {
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
  netForce: number;
  gravityForce: number;
  frictionForce: number;
  archimedesThrust: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
}

export interface SimulationState {
  params: SimulationParams;
  isRunning: boolean;
  time: number;
  position: number;
  velocity: number;
  acceleration: number;
  netForce: number;
  history: SimulationHistoryPoint[];
  gravityForce: number;
  frictionForce: number;
  archimedesThrust: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
}