import channels from './Channels'
class HearingTestConfiguration {
  constructor(configuration) {
    this.channels = Object.values(channels)
    this.configuration = configuration.map(item => {
      return {
        frequency: item.freq,
        step: item.step
      }
    })
  }
  
  get frequencies () {
    return this.configuration.map(item => item.frequency)
  }
  
  get steps () {
    return this.configuration.map(item => item.step)
  }
  
}

module.exports = HearingTestConfiguration