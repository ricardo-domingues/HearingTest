import channels from './Channels'

class HearingTestEvaluation {
  constructor () {
    this.results = {}
    Object.values(channels).forEach(channel => {
      this.results[channel] = []
    })
  }

  recordResult(frequency, amplitude, channel) {
    console.log('Writing Result - Channel: ' + channel + ' Frequency: ' + frequency + ' Amplitude: ' + amplitude)
    this.results[channel].push({frequency, amplitude})
  }

  evaluate () {
    let left = this.getAverageLossByEar('left')
    let right = this.getAverageLossByEar('right')

    return {left, right}
  }

  getAverageLossByEar (ear) {
    let size = this.results[ear].length
    let sum = this.results[ear]
      .map(result => result.amplitude)
      .reduce((a, b) => {
        return a + b
      }, 0)

    return (sum / size) + 80
  }

  hasResultForStage (channel, frequency) {
    return this.results[channel].some(item => item.frequency === frequency)
  }
}

module.exports = HearingTestEvaluation