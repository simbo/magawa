/**
 * Lifecycle states of a game, including the period before its first tile click.
 */
export enum GameStatus {
  Closed,
  Running,
  Paused,
  Finished
}

/**
 * Possible outcomes of a completed game.
 */
export enum GameFinalStatus {
  Lost,
  Won
}
