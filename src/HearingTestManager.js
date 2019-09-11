import Tone from 'tone'
class HearingTestManager {
  constructor (hearingTestConfiguration, hearingTestEvaluation) {
    this.hearingTestConfiguration = hearingTestConfiguration
    this.hearingTestEvaluation = hearingTestEvaluation
    this.isPlaying = false
    this.hasEnded = false
    this.beepDuration = 3000
    this.beepInterval = 1000
    this.level = 0
    this.currentChannelIndex = 0
    this.amplitudeLevel = 0
    this.amplitudes = [-80, -70, -60, -50]
  }

  get evaluationInterval () {
    return this.beepDuration + this.beepInterval
  }
  
  setEndedCallback (fn) {
    this.onFinish = fn
  }

  init () {
    this.isPlaying = true

    this.currentFrequency = this.hearingTestConfiguration.frequencies[0]

    this.currentAmplitude = this.amplitudes[0]

    this.currentChannel = this.hearingTestConfiguration.channels[this.currentChannelIndex]

    // Start beep´s
    this.interval = setInterval(() => {
      this.testIteration(this.currentFrequency, this.currentChannel)
    }, this.evaluationInterval)
  }

  testIteration (frequency, channel) {
    this.playBeep(frequency, this.beepDuration, this.currentAmplitude, channel)

    // If has complete all amplitudes for given frequency
    if (this.currentAmplitude === this.amplitudes[this.amplitudes.length - 1]) {
          
      // Fake user input because user didnt register any beep for given frequency and amplitude
      this.hearingTestEvaluation.recordResult(this.currentFrequency, this.currentAmplitude, channel)
      
      this.processHearingTestIteration()

    } else {
      // If not increase it
      this.increaseAmplitude()
    }
  }

  resetHearingTest () {
    this.level = 0
    this.amplitudeLevel = 0
    this.currentAmplitude = this.amplitudes[this.amplitudeLevel]
    this.currentFrequency = this.hearingTestConfiguration.frequencies[this.level]
    console.log(this.hearingTestConfiguration)
    this.currentChannel = this.hearingTestConfiguration.channels[1]
  }

  moveNextStage () {
    this.increaseFrequency()

    clearInterval(this.interval)
    
    this.interval = setInterval(() => {
      this.testIteration(this.hearingTestConfiguration.frequencies[this.level], this.currentChannel)
    }, this.evaluationInterval)
  }

  processHearingTestIteration () {
    // If there is yet frequencies to run
    if (this.level < this.hearingTestConfiguration.frequencies.length - 1) {

      this.moveNextStage()

    } else {
      clearInterval(this.interval)
      // If the hearing test was not run for both ears yet
      if (Object.values(this.hearingTestEvaluation.results).some(ear => ear.length === 0)) {
        // Reset hearing test properties
        this.resetHearingTest()

        // Run hearing test for the other channel
        this.interval = setInterval(() => {
          this.testIteration(this.hearingTestConfiguration.frequencies[this.level], this.currentChannel)
        }, this.evaluationInterval)
      } else {
        // Hearing test has finished
        let evaluation = this.hearingTestEvaluation.evaluate()
        console.log('Final Evaluation: ', evaluation)
        console.log(this.onFinish)
        this.onFinish(evaluation)
      }          
    }
  }

  processUserInput() {
    if (this.isPlaying) {

      if (this.amplitudeLevel -1 >= 0) {
        console.log(`Current Frequency: ${this.currentFrequency} - Current Amplitude: ${this.amplitudes[this.amplitudeLevel - 1]} - Current Channel: ${this.currentChannel}`)
        this.hearingTestEvaluation.recordResult(this.currentFrequency, this.amplitudes[this.amplitudeLevel - 1], this.currentChannel)
      }

      if (this.hearingTestEvaluation.hasResultForStage(this.currentChannel, this.currentFrequency)) {
        
        this.processHearingTestIteration()
      }
      console.log(this.hearingTestEvaluation.results)
      console.log(this.hearingTestEvaluation.hasResultForStage(this.currentChannel, this.currentFrequency))

    } else {
      throw new Error('The Hearing Test must be running in order to evaluate user action')
    }
  }

  increaseAmplitude () {
    this.amplitudeLevel += 1;
    this.currentAmplitude = this.amplitudes[this.amplitudeLevel]
  }

  increaseFrequency () {
    this.level += 1;
    this.amplitudeLevel = 0;
    this.currentAmplitude = this.amplitudes[this.amplitudeLevel]
    this.currentFrequency = this.hearingTestConfiguration.frequencies[this.level]
  }

  // TODO
  pauseTest() {
    console.log('pausing test')
  }

  playBeep(frequency, duration, amplitude, channel) {

    console.log('Playing Frequency: ' + frequency + ' Amplitude: ' + amplitude + ' Channel: ' + channel)
    
    // Merge is used to decide which channel should the beep play
    let merge = new Tone.Merge().toMaster()

    /* 
    * Maybe we don´t need to initialize tone always but I didn´t find any solution 
    * to disconnect previous channel.. This cause that in the first iteration the beep´s only play
    * in the correct channel but when it goes to the other it plays on both...
    */
    let tone = new Tone.Oscillator().connect(merge[channel]);        

    // Set both amplitude and frequency for given "level"
    tone.frequency.value = frequency

    tone.volume.value = amplitude
    tone.start()
    this.isBeeping = true
    setTimeout(() => {
      tone.stop()
      this.isBeeping = false
    }, duration)
  }
}

export default HearingTestManager