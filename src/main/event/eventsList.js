const events = Object.freeze({
    GAME_INIT: 'gameInit',
    GAME_START: 'gameStart',
    GAME_PAUSE: 'gamePause',
    GAME_UNPAUSE: 'gameUnpause',
    GAME_RESTART: 'gameRestart',
    GAME_ENDED: 'gameEnded',
    VALUE_SET: 'valueSet',
    CELL_SELECT: 'cellSelect',
    CELL_SELECTED: 'cellSelected',
    FIELD_UPDATED: 'fieldUpdated',
    FIELD_FILLED: 'fieldIsFull',
    WIN_CONDITION: 'winCondition'
});


export { events };