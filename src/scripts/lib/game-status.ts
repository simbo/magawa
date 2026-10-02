/**
 * Lifecycle states of a game, including the period before its first tile click.
 */
export enum GameStatus {
  Closed = 0,
  Running = 1,
  Paused = 2,
  Finished = 3,
}

/**
 * Possible outcomes of a completed game.
 */
export enum GameFinalStatus {
  Lost = 0,
  Won = 1,
}
