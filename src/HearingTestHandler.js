import HearingTestManager from './HearingTestManager'
import HearingTestEvaluation from './HearingTestEvaluation'
import HearingTestConfiguration from './HearingTestConfiguration'

import configuration from './configuration'

class HearingTestHandler {
  constructor () {
    this.hearingTestManager = new HearingTestManager(
      new HearingTestConfiguration(configuration),
      new HearingTestEvaluation()
    )
  }

  init () {
    try {
      if (!this.hearingTestManager.isPlaying) {
        this.hearingTestManager.init()
      }
    } catch (err) {
      console.log(err)
    }
  }

  handleUserInput () {
    this.hearingTestManager.processUserInput()
  }

  set setOnHearingTestFinished (fn) {
    console.log(this.hearingTestManager)
    this.hearingTestManager.setEndedCallback(fn)
  }
}

export default HearingTestHandler