/* @flow */

import {createSelector} from "reselect"

import type {State} from "../types"
import {contains} from "../../lib/Tuple"
import {getStarredLogs} from "../reducers/starredLogs"
import {toHistory} from "./reducer"
import Log from "../../models/Log"

const getLogDetails = (state: State) => {
  return state.logDetails
}

const getPosition = (state: State) => {
  return state.logDetails.position
}

const getPrevPosition = (state: State) => {
  return state.logDetails.prevPosition
}

const getHistory = createSelector<State, void, *, *>(
  getLogDetails,
  (logDetails) => toHistory(logDetails)
)

const getPrevExists = createSelector<State, void, *, *>(getHistory, (history) =>
  history.prevExists()
)

const getNextExists = createSelector<State, void, *, *>(getHistory, (history) =>
  history.nextExists()
)

const getIsGoingBack = createSelector<State, void, *, *, *>(
  getPosition,
  getPrevPosition,
  (position, prevPosition) => prevPosition - position < 0
)

const build = createSelector<State, void, *, *>(getHistory, (history) => {
  const log = history.getCurrent()
  return log ? new Log(log.tuple, log.descriptor) : null
})

const getIsStarred = createSelector<State, void, *, *, *>(
  build,
  getStarredLogs,
  (log, starred) => {
    return log ? contains(starred, log.tuple) : false
  }
)

export default {
  getLogDetails,
  getPosition,
  getPrevPosition,
  getIsStarred,
  build,
  getIsGoingBack,
  getNextExists,
  getPrevExists,
  getHistory
}
