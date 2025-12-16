// eee code onyl play audio click chesina tarvaatta speech recognising avuthi see after 435th  line

// import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// import { interviewService } from 'src/app/core/services/aiinterview.service';
// import { interviewaudio } from 'src/environments/environment.development';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-aiinterview',
//   templateUrl: './aiinterview.component.html',
//   styleUrls: ['./aiinterview.component.css']
// })

// export class AiinterviewComponent implements OnInit, AfterViewInit, OnDestroy {

//   currentIndex = 0;
//   audioContext: any;

//   questions: any[] = [];
//   currentQuestion: any;

//   Audiourl = '';

//   micStream: any = null;
//   micContext: any = null;
//   micAnalyser: any = null;

//   recognition: any;
//   silenceTimer: any = null;
//   SILENCE_LIMIT = 5000;

//   audioCanvas: any;
//   micCanvas: any;

//   studentSpeech = "";
//   speechBuffer = "";

//   isFirstPlayDone = false;
//   recognitionActive = false;
//   isPlayingAudio = false;
//   isRecognitionPaused = false;
//   questionAudioCompleted = false;
//   silenceTimerRunning = false;

//   constructor(private router: Router, private _interviewService: interviewService) { }

//   ngOnInit(): void {
//     this._interviewService.getAiInterviewData().subscribe({
//       next: (res) => {
//         console.log('Interview API:', res);

//         this.questions = res.data.data.questions;
//         this.currentIndex = 0;
//         this.currentQuestion = this.questions[this.currentIndex];
//       },
//       error: (err) => {
//         console.error('Interview API error:', err);
//       }
//     });
//   }

//   ngAfterViewInit(): void {
//     setTimeout(() => {
//       this.audioCanvas = this.makeVisualizer('audioCanvas');
//       this.micCanvas = this.makeVisualizer('micCanvas');
//       this.startMic();
//       this.initSpeechRecognition();
//       this.startSpeechRecognition();
//     }, 100);
//   }

//   ngOnDestroy(): void {
//     this.stopSpeechRecognition();
//     if (this.micStream) this.micStream.getTracks().forEach((t: any) => t.stop());
//     if (this.silenceTimer) clearTimeout(this.silenceTimer);
//     if (this.micContext) this.micContext.close();
//     if (this.audioContext) this.audioContext.close();
//   }

//   startInterview() {
//     if (!this.questions.length) {
//       console.warn('Questions not ready yet');
//       return;
//     }

//     if (this.isFirstPlayDone) return;

//     this.isFirstPlayDone = true;
//     this.loadQuestion();
//     this.startAudio();
//   }

//   loadQuestion() {
//     this.currentQuestion = this.questions[this.currentIndex];

//     const category = this.currentQuestion.category;
//     const qid = this.currentQuestion.id;

//     this.Audiourl = `${interviewaudio}/app/Assets/AI-Interview/${category}/${qid}.mp3`;

//     console.log('Audio URL:', this.Audiourl
//     );
//   }

//   startAudio() {
//     this.loadQuestion();
//     this.isPlayingAudio = true;
//     this.pauseSpeechRecognition();

//     if (!this.audioContext)
//       this.audioContext = new AudioContext();

//     const audio = new Audio(this.Audiourl
//     );
//     audio.crossOrigin = "anonymous";

//     const src = this.audioContext.createMediaElementSource(audio);
//     const analyser = this.audioContext.createAnalyser();
//     analyser.fftSize = 256;

//     src.connect(analyser);
//     analyser.connect(this.audioContext.destination);

//     this.drawVisualizer(this.audioCanvas.ctx, analyser);
//     this.studentSpeech = "";
//     this.speechBuffer = "";

//     audio.play();

//     audio.onended = () => {
//       this.isPlayingAudio = false;
//       this.questionAudioCompleted = true;

//       this.resumeSpeechRecognition();

//       this.startSilenceTimer();
//     };


//     audio.onerror = (error) => {
//       console.error('Audio playback error:', error);
//       this.isPlayingAudio = false;
//       this.resumeSpeechRecognition();
//     };
//   }

//   async startMic() {
//     try {
//       this.micStream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         }
//       });

//       this.micContext = new AudioContext();
//       const src = this.micContext.createMediaStreamSource(this.micStream);

//       this.micAnalyser = this.micContext.createAnalyser();
//       this.micAnalyser.fftSize = 256;

//       src.connect(this.micAnalyser);

//       this.drawVisualizer(this.micCanvas.ctx, this.micAnalyser);

//     } catch (err) {
//       console.error("Mic permission denied:", err);
//     }
//   }

//   initSpeechRecognition() {
//     const Speech =
//       (window as any).SpeechRecognition ||
//       (window as any).webkitSpeechRecognition;

//     if (!Speech) {
//       console.error("Speech Recognition not supported in this browser");
//       return;
//     }

//     this.recognition = new Speech();
//     this.recognition.lang = "en-US";
//     this.recognition.continuous = true;
//     this.recognition.interimResults = true;
//     this.recognition.maxAlternatives = 1;
//     this.recognition.interimResults = false;
//     if (this.recognition.grammars) {
//     }
//   }

//   startSpeechRecognition() {
//     if (this.recognitionActive || !this.recognition) return;

//     this.recognitionActive = true;
//     this.isRecognitionPaused = false;

//     this.recognition.onresult = (event: any) => {
//       if (this.isRecognitionPaused) return;

//       let finalText = this.speechBuffer;
//       let gotNewText = false;

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const res = event.results[i];

//         if (res.isFinal) {
//           const text = res[0].transcript.trim();
//           if (text) {
//             finalText += text + " ";
//             this.speechBuffer = finalText;
//             gotNewText = true;
//           }
//         }
//       }

//       if (gotNewText) {
//         this.studentSpeech = this.speechBuffer.trim();
//         if (this.questionAudioCompleted) {
//         }
//       }

//     };

//     this.recognition.onresult = (event: any) => {
//       if (!this.questionAudioCompleted) return;

//       let gotText = false;

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         if (event.results[i].isFinal) {
//           const text = event.results[i][0].transcript.trim();
//           if (text) {
//             this.speechBuffer += text + ' ';
//             gotText = true;
//           }
//         }
//       }

//       if (gotText) {
//         this.studentSpeech = this.speechBuffer.trim();
//         this.resetSilenceTimer();
//       }
//     };


//     this.recognition.onend = () => {
//       if (!this.isRecognitionPaused && this.currentIndex < this.questions.length) {
//         setTimeout(() => {
//           try {
//             this.recognition.start();
//             this.recognitionActive = true;
//           } catch { }
//         }, 200);
//       }
//     };

//     try {
//       this.recognition.start();
//     } catch (err) {
//       console.error("Failed to start speech recognition:", err);
//     }
//   }

//   pauseSpeechRecognition() {
//     if (this.recognition && this.recognitionActive) {
//       try {
//         this.recognition.stop();
//         this.isRecognitionPaused = true;
//         console.log("Speech recognition paused");
//       } catch (err) {
//         console.error("Error pausing speech recognition:", err);
//       }
//     }
//   }

//   resumeSpeechRecognition() {
//     if (this.recognition && this.isRecognitionPaused) {
//       setTimeout(() => {
//         try {
//           this.recognition.start();
//           this.recognitionActive = true;
//           this.isRecognitionPaused = false;
//           console.log("Speech recognition resumed");
//         } catch (err) {
//           console.error("Error resuming speech recognition:", err);
//         }
//       }, 200);
//     }
//   }

//   stopSpeechRecognition() {
//     if (this.recognition) {
//       try {
//         this.recognition.stop();
//         this.recognitionActive = false;
//         this.isRecognitionPaused = false;
//       } catch { }
//     }
//   }

//   startSilenceTimer() {
//     if (this.silenceTimerRunning) return;
//     if (!this.questionAudioCompleted) return;

//     this.silenceTimerRunning = true;

//     this.silenceTimer = setTimeout(() => {
//       this.silenceTimerRunning = false;
//       this.goToNextQuestion();
//     }, this.SILENCE_LIMIT);
//   }

//   resetSilenceTimer() {
//     if (!this.silenceTimerRunning) return;

//     clearTimeout(this.silenceTimer);

//     this.silenceTimer = setTimeout(() => {
//       this.silenceTimerRunning = false;
//       this.goToNextQuestion();
//     }, this.SILENCE_LIMIT);
//   }

//   goToNextQuestion() {
//     if (this.currentIndex === this.questions.length - 1) {
//       this.finishInterview();
//       return;
//     }

//     this.currentIndex++;

//     this.studentSpeech = '';
//     this.speechBuffer = '';

//     clearTimeout(this.silenceTimer);
//     this.silenceTimerRunning = false;
//     this.questionAudioCompleted = false;

//     this.loadQuestion();
//     this.startAudio();
//   }

//   finishInterview() {
//     this.stopSpeechRecognition();
//     const student = document.getElementById("studentSection");
//     if (student) student.style.display = "none";

//     const btn = document.getElementById("startAudioBtn");
//     if (btn) btn.style.display = "none";

//     const speechBox = document.getElementById("studentSpeechText");
//     if (speechBox) speechBox.style.display = "none";

//     if (this.micStream)
//       this.micStream.getTracks().forEach((t: any) => t.stop());

//     if (this.micContext) this.micContext.close();
//     if (this.audioContext) this.audioContext.close();

//     if (this.silenceTimer) clearTimeout(this.silenceTimer);

//     const done = document.getElementById("studentComplete");
//     if (done) done.style.display = "block";
//   }

//   makeVisualizer(id: string) {
//     const canvas: any = document.getElementById(id);
//     if (!canvas) {
//       console.error(`Canvas with id ${id} not found`);
//       return { canvas: null, ctx: null };
//     }

//     const ctx = canvas.getContext("2d");

//     const resize = () => {
//       canvas.width = canvas.offsetWidth * devicePixelRatio;
//       canvas.height = canvas.offsetHeight * devicePixelRatio;
//       ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
//     };

//     resize();
//     window.addEventListener("resize", resize);

//     return { canvas, ctx };
//   }

//   drawVisualizer(ctx: any, analyser: any) {
//     if (!ctx || !analyser) return;

//     const dataArray = new Uint8Array(64);

//     const loop = () => {
//       requestAnimationFrame(loop);

//       if (!analyser) return;

//       analyser.getByteFrequencyData(dataArray);

//       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//       const cx = ctx.canvas.width / devicePixelRatio / 2;
//       const cy = ctx.canvas.height / devicePixelRatio / 2;

//       const inner = 60;
//       const outer = 80;
//       const bars = 64;
//       const slice = (Math.PI * 2) / bars;

//       for (let i = 0; i < bars; i++) {
//         const v = dataArray[i] / 255;
//         const len = inner + v * (outer - inner);
//         const angle = slice * i;

//         const x0 = cx + Math.cos(angle) * inner;
//         const y0 = cy + Math.sin(angle) * inner;
//         const x1 = cx + Math.cos(angle) * len;
//         const y1 = cy + Math.sin(angle) * len;

//         ctx.strokeStyle = `rgba(0,200,255,${0.4 + v * 0.6})`;
//         ctx.lineWidth = 4;
//         ctx.lineCap = "round";

//         ctx.beginPath();
//         ctx.moveTo(x0, y0);
//         ctx.lineTo(x1, y1);
//         ctx.stroke();
//       }
//     };

//     loop();
//   }

// }


// my code dentlo b4 playAudio clicking speech recognising starts see after 958th  line

// import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
// import { interviewService } from 'src/app/core/services/aiinterview.service';
// import { interviewaudio } from 'src/environments/environment.development';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-aiinterview',
//   templateUrl: './aiinterview.component.html',
//   styleUrls: ['./aiinterview.component.css']
// })
// export class AiinterviewComponent implements OnInit, AfterViewInit, OnDestroy {


//   questions: any[] = [];
//   currentIndex = 0;
//   currentQuestion: any;
//   Audiourl = '';


//   audioContext: any;
//   micContext: any = null;
//   micAnalyser: any = null;
//   currentAudioSource: any = null;
//   currentAudioElement: HTMLAudioElement | null = null;


//   recognition: any;
//   recognitionActive = false;
//   isRecognitionStarting = false;
//   recognitionRestartTimeout: any = null;
//   finalTranscript = '';
//   interimTranscript = '';


//   studentSpeech = '';


//   lastSpeechTime = 0;
//   silenceWatcher: any;
//   SILENCE_LIMIT = 5000;


//   audioCanvas: any;
//   micCanvas: any;
//   micStream: any = null;


//   isPlayingAudio = false;
//   isFirstPlayDone = false;
//   isAudioTriggeredByUser = false;

//   constructor(
//     private router: Router,
//     private _interviewService: interviewService,
//     private ngZone: NgZone
//   ) { }


//   ngOnInit(): void {
//     this._interviewService.getAiInterviewData().subscribe({
//       next: (res) => {
//         this.questions = res.data.data.questions || [];
//         this.currentIndex = 0;
//         if (this.questions.length > 0) {
//           this.currentQuestion = this.questions[this.currentIndex];
//         }
//       },
//       error: (err) => console.error('Interview API error:', err)
//     });
//   }

//   ngAfterViewInit(): void {
//     setTimeout(() => {
//       this.audioCanvas = this.makeVisualizer('audioCanvas');
//       this.micCanvas = this.makeVisualizer('micCanvas');

//       this.startMic();
//       this.initSpeechRecognition();


//       this.startSpeechRecognition();
//     }, 100);
//   }

//   ngOnDestroy(): void {
//     this.cleanup();
//   }


//   startInterview() {
//     if (!this.questions.length) {
//       console.warn('Questions not ready yet');
//       return;
//     }

//     if (this.isFirstPlayDone) return;
//     this.isFirstPlayDone = true;


//     if (!this.audioContext) {
//       this.audioContext = new AudioContext();
//     }
//     if (this.audioContext.state === 'suspended') {
//       this.audioContext.resume();
//     }

//     this.loadQuestion();
//     this.playInterviewerAudio();
//   }

//   loadQuestion() {
//     this.currentQuestion = this.questions[this.currentIndex];
//     const { category, id } = this.currentQuestion;
//     this.Audiourl = `${interviewaudio}/app/Assets/AI-Interview/${category}/${id}.mp3`;
//   }

//   playInterviewerAudio() {

//     this.stopSpeechRecognition();
//     this.stopSilenceWatcher();


//     this.cleanupAudioElement();

//     this.isPlayingAudio = true;
//     this.studentSpeech = '';
//     this.finalTranscript = '';
//     this.interimTranscript = '';


//     if (!this.audioContext) {
//       this.audioContext = new AudioContext();
//     }
//     if (this.audioContext.state === 'suspended') {
//       this.audioContext.resume();
//     }


//     this.currentAudioElement = new Audio(this.Audiourl);
//     this.currentAudioElement.crossOrigin = "anonymous";


//     this.currentAudioSource = this.audioContext.createMediaElementSource(this.currentAudioElement);
//     const analyser = this.audioContext.createAnalyser();
//     analyser.fftSize = 256;

//     this.currentAudioSource.connect(analyser);
//     analyser.connect(this.audioContext.destination);

//     this.drawVisualizer(this.audioCanvas.ctx, analyser);


//     this.currentAudioElement.play().catch(err => {
//       console.error('Audio play error:', err);
//       this.handleAudioEnded();
//     });


//     this.currentAudioElement.onended = () => {
//       this.handleAudioEnded();
//     };

//     this.currentAudioElement.onerror = (err) => {
//       console.error('Audio error:', err);
//       this.handleAudioEnded();
//     };
//   }

//   handleAudioEnded() {
//     this.isPlayingAudio = false;


//     setTimeout(() => {
//       this.startSpeechRecognition();
//       this.startSilenceWatcher();
//     }, 300);
//   }

//   goToNextQuestion() {
//     this.stopSilenceWatcher();

//     if (this.currentIndex >= this.questions.length - 1) {
//       this.finishInterview();
//       return;
//     }

//     this.currentIndex++;
//     this.loadQuestion();


//     this.studentSpeech = '';
//     this.finalTranscript = '';
//     this.interimTranscript = '';


//     this.playInterviewerAudio();
//   }

//   initSpeechRecognition() {
//     const SpeechRecognition =
//       (window as any).SpeechRecognition ||
//       (window as any).webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.error('Speech recognition not supported');
//       return;
//     }

//     this.recognition = new SpeechRecognition();


//     this.recognition.lang = 'en-US';
//     this.recognition.continuous = true;
//     this.recognition.interimResults = true;
//     this.recognition.maxAlternatives = 3;


//     this.recognition.onresult = (event: any) => {

//       if (this.isPlayingAudio) {
//         return;
//       }

//       this.ngZone.run(() => {

//         let fullTranscript = '';


//         for (let i = 0; i < event.results.length; i++) {
//           const transcript = event.results[i][0].transcript;
//           fullTranscript += transcript;


//           if (i < event.results.length - 1) {
//             fullTranscript += ' ';
//           }
//         }


//         if (fullTranscript.trim()) {
//           this.studentSpeech = fullTranscript.trim();
//           this.lastSpeechTime = Date.now();
//         }
//       });
//     };


//     this.recognition.onstart = () => {
//       console.log('Speech recognition started');
//       this.recognitionActive = true;
//       this.isRecognitionStarting = false;
//     };


//     this.recognition.onend = () => {
//       console.log('Speech recognition ended');
//       this.recognitionActive = false;


//       if (!this.isPlayingAudio && !this.isRecognitionStarting) {
//         this.recognitionRestartTimeout = setTimeout(() => {
//           this.startSpeechRecognition();
//         }, 100);
//       }
//     };


//     this.recognition.onerror = (event: any) => {
//       console.error('Speech recognition error:', event.error);


//       if (event.error === 'no-speech' || event.error === 'audio-capture') {

//         return;
//       }

//       if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         console.error('Microphone permission denied');
//         this.recognitionActive = false;
//         return;
//       }


//       this.recognitionActive = false;
//     };
//   }

//   startSpeechRecognition() {

//     if (this.recognitionActive || this.isRecognitionStarting || this.isPlayingAudio) {
//       return;
//     }

//     if (!this.recognition) {
//       console.error('Recognition not initialized');
//       return;
//     }

//     this.isRecognitionStarting = true;

//     try {
//       this.recognition.start();
//     } catch (error: any) {
//       console.error('Error starting recognition:', error);
//       this.isRecognitionStarting = false;

//       if (error.message && error.message.includes('already started')) {
//         this.recognitionActive = true;
//       }
//     }
//   }

//   stopSpeechRecognition() {

//     if (this.recognitionRestartTimeout) {
//       clearTimeout(this.recognitionRestartTimeout);
//       this.recognitionRestartTimeout = null;
//     }

//     if (!this.recognition || !this.recognitionActive) {
//       return;
//     }

//     try {
//       this.recognition.stop();
//       this.recognitionActive = false;
//       this.isRecognitionStarting = false;
//     } catch (error) {
//       console.error('Error stopping recognition:', error);
//     }
//   }

//   startSilenceWatcher() {
//     this.stopSilenceWatcher();
//     this.lastSpeechTime = Date.now();

//     this.silenceWatcher = setInterval(() => {
//       const silenceDuration = Date.now() - this.lastSpeechTime;

//       if (silenceDuration >= this.SILENCE_LIMIT) {
//         console.log('Silence detected, moving to next question');
//         this.goToNextQuestion();
//       }
//     }, 500);
//   }

//   stopSilenceWatcher() {
//     if (this.silenceWatcher) {
//       clearInterval(this.silenceWatcher);
//       this.silenceWatcher = null;
//     }
//   }

//   async startMic() {
//     try {
//       this.micStream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,

//           sampleRate: 48000,
//           channelCount: 1
//         }
//       });

//       this.micContext = new AudioContext();
//       const source = this.micContext.createMediaStreamSource(this.micStream);

//       this.micAnalyser = this.micContext.createAnalyser();
//       this.micAnalyser.fftSize = 256;
//       this.micAnalyser.smoothingTimeConstant = 0.8;

//       source.connect(this.micAnalyser);

//       if (this.micCanvas.ctx) {
//         this.drawVisualizer(this.micCanvas.ctx, this.micAnalyser);
//       }

//     } catch (err) {
//       console.error('Microphone access denied:', err);
//     }
//   }

//   makeVisualizer(id: string) {
//     const canvas: any = document.getElementById(id);
//     if (!canvas) {
//       console.error(`Canvas ${id} not found`);
//       return { canvas: null, ctx: null };
//     }

//     const ctx = canvas.getContext('2d');

//     const resize = () => {
//       canvas.width = canvas.offsetWidth * devicePixelRatio;
//       canvas.height = canvas.offsetHeight * devicePixelRatio;
//       ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
//     };

//     resize();
//     window.addEventListener('resize', resize);

//     return { canvas, ctx };
//   }

//   drawVisualizer(ctx: any, analyser: any) {
//     if (!ctx || !analyser) return;

//     const dataArray = new Uint8Array(64);

//     const animate = () => {
//       requestAnimationFrame(animate);

//       if (!analyser) return;

//       analyser.getByteFrequencyData(dataArray);

//       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//       const cx = ctx.canvas.width / devicePixelRatio / 2;
//       const cy = ctx.canvas.height / devicePixelRatio / 2;

//       const innerRadius = 60;
//       const outerRadius = 80;
//       const barCount = 64;
//       const angleStep = (Math.PI * 2) / barCount;

//       for (let i = 0; i < barCount; i++) {
//         const value = dataArray[i] / 255;
//         const length = innerRadius + value * (outerRadius - innerRadius);
//         const angle = angleStep * i;

//         const x0 = cx + Math.cos(angle) * innerRadius;
//         const y0 = cy + Math.sin(angle) * innerRadius;
//         const x1 = cx + Math.cos(angle) * length;
//         const y1 = cy + Math.sin(angle) * length;

//         ctx.strokeStyle = `rgba(0, 200, 255, ${0.4 + value * 0.6})`;
//         ctx.lineWidth = 4;
//         ctx.lineCap = 'round';

//         ctx.beginPath();
//         ctx.moveTo(x0, y0);
//         ctx.lineTo(x1, y1);
//         ctx.stroke();
//       }
//     };

//     animate();
//   }

//   cleanupAudioElement() {
//     if (this.currentAudioElement) {
//       this.currentAudioElement.pause();
//       this.currentAudioElement.onended = null;
//       this.currentAudioElement.onerror = null;
//       this.currentAudioElement = null;
//     }

//     if (this.currentAudioSource) {
//       try {
//         this.currentAudioSource.disconnect();
//       } catch (e) { }
//       this.currentAudioSource = null;
//     }
//   }

//   cleanup() {

//     this.stopSpeechRecognition();
//     this.stopSilenceWatcher();


//     if (this.recognitionRestartTimeout) {
//       clearTimeout(this.recognitionRestartTimeout);
//     }


//     this.cleanupAudioElement();


//     if (this.micStream) {
//       this.micStream.getTracks().forEach((track: any) => track.stop());
//       this.micStream = null;
//     }


//     if (this.micContext) {
//       this.micContext.close();
//       this.micContext = null;
//     }

//     if (this.audioContext) {
//       this.audioContext.close();
//       this.audioContext = null;
//     }
//   }

//   finishInterview() {
//     this.cleanup();


//     const elements = [
//       'studentSection',
//       'startAudioBtn',
//       'studentSpeechText'
//     ];

//     elements.forEach(id => {
//       const el = document.getElementById(id);
//       if (el) el.style.display = 'none';
//     });


//     const done = document.getElementById('studentComplete');
//     if (done) done.style.display = 'block';
//   }
// }



// prasaad code same mode but this acccuracy is superior than my code

// import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
// import { interviewService } from 'src/app/core/services/aiinterview.service';
// import { interviewaudio } from 'src/environments/environment.development';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-aiinterview',
//   templateUrl: './aiinterview.component.html',
//   styleUrls: ['./aiinterview.component.css']
// })
// export class AiinterviewComponent implements OnInit, AfterViewInit, OnDestroy {

//   /* ---------------- DATA ---------------- */
//   questions: any[] = [];
//   currentIndex = 0;
//   currentQuestion: any;
//   Audiourl = '';

//   /* ---------------- FLAGS ---------------- */
//   isInterviewerSpeaking = false;
//   isPlayingAudio = false;
//   isFirstPlayDone = false;
//   questionAudioCompleted = false;

//   /* ---------------- SPEECH ---------------- */
//   recognition: any;
//   recognitionActive = false;
//   studentSpeech = '';
//   finalTranscript = '';

//   /* ---------------- SILENCE ---------------- */
//   lastSpeechTime = 0;
//   silenceWatcher: any;
//   SILENCE_LIMIT = 5000;

//   /* ---------------- AUDIO ---------------- */
//   audioContext: AudioContext | null = null;

//   /* ---------------- VISUALS ---------------- */
//   audioCanvas: any;
//   micCanvas: any;

//   /* ---------------- MIC ---------------- */
//   micStream: any = null;
//   micContext: AudioContext | null = null;
//   micAnalyser: any = null;

//   constructor(
//     private router: Router,
//     private _interviewService: interviewService,
//     private zone: NgZone
//   ) { }

//   /* ================= INIT ================= */

//   ngOnInit(): void {
//     this._interviewService.getAiInterviewData().subscribe({
//       next: (res) => {
//         this.questions = res?.data?.data?.questions || [];
//         this.currentIndex = 0;
//         this.currentQuestion = this.questions[0];
//       },
//       error: (err) => console.error('Interview API error:', err)
//     });
//   }

//   ngAfterViewInit(): void {
//     this.audioCanvas = this.makeVisualizer('audioCanvas');
//     this.micCanvas = this.makeVisualizer('micCanvas');

//     this.startMic();
//     this.initSpeechRecognition();
//     this.startSpeechRecognition(); // Start immediately - mic always on
//   }

//   ngOnDestroy(): void {
//     this.stopSpeechRecognition();
//     this.stopSilenceWatcher();

//     this.micStream?.getTracks().forEach((t: any) => t.stop());
//     this.micContext?.close();
//     this.audioContext?.close();
//   }

//   /* ================= INTERVIEW FLOW ================= */

//   startInterview() {
//     if (!this.questions.length || this.isFirstPlayDone) return;

//     this.isFirstPlayDone = true;

//     if (!this.audioContext)
//       this.audioContext = new AudioContext();

//     if (this.audioContext.state === 'suspended')
//       this.audioContext.resume();

//     this.loadQuestion();
//     this.playQuestionAudio();
//   }

//   loadQuestion() {
//     this.currentQuestion = this.questions[this.currentIndex];
//     const { category, id } = this.currentQuestion;

//     this.Audiourl =
//       `${interviewaudio}/app/Assets/AI-Interview/${category}/${id}.mp3`;
//   }

//   playQuestionAudio() {
//     this.stopSilenceWatcher();
//     this.stopSpeechRecognition(); // Stop recognition during audio

//     this.isInterviewerSpeaking = true;
//     this.isPlayingAudio = true;

//     // Reset transcripts for new question
//     this.finalTranscript = '';
//     this.studentSpeech = '';

//     if (!this.audioContext)
//       this.audioContext = new AudioContext();

//     if (this.audioContext.state === 'suspended')
//       this.audioContext.resume();

//     const audio = new Audio(this.Audiourl);
//     audio.crossOrigin = 'anonymous';

//     const src = this.audioContext.createMediaElementSource(audio);
//     const analyser = this.audioContext.createAnalyser();
//     analyser.fftSize = 256;

//     src.connect(analyser);
//     analyser.connect(this.audioContext.destination);

//     this.drawVisualizer(this.audioCanvas.ctx, analyser);

//     audio.play();

//     audio.onended = () => {
//       this.zone.run(() => {
//         this.isInterviewerSpeaking = false;
//         this.isPlayingAudio = false;
//         this.questionAudioCompleted = true;

//         // Restart recognition immediately after audio ends
//         this.startSpeechRecognition();
//         this.startSilenceWatcher();
//       });
//     };
//   }

//   /* ================= SPEECH - OPTIMIZED FOR FAST SPEECH ================= */

//   initSpeechRecognition() {
//     const Speech =
//       (window as any).SpeechRecognition ||
//       (window as any).webkitSpeechRecognition;

//     if (!Speech) {
//       console.error('Speech recognition not supported');
//       return;
//     }

//     this.recognition = new Speech();
//     this.recognition.lang = 'en-US';
//     this.recognition.continuous = true;
//     this.recognition.interimResults = true;
//     this.recognition.maxAlternatives = 3; // More alternatives for better accuracy

//     // Handle results - CAPTURES FAST SPEECH
//     this.recognition.onresult = (event: any) => {
//       // Don't capture during interviewer audio
//       if (this.isInterviewerSpeaking || this.isPlayingAudio) return;

//       this.zone.run(() => {
//         // Build complete transcript from ALL results for fast speech
//         let completeText = '';

//         for (let i = 0; i < event.results.length; i++) {
//           completeText += event.results[i][0].transcript;
//           if (i < event.results.length - 1) {
//             completeText += ' ';
//           }
//         }

//         // Display exactly as student speaks - NO corrections
//         if (completeText.trim()) {
//           this.studentSpeech = completeText.trim();
//           this.lastSpeechTime = Date.now();
//         }
//       });
//     };

//     // Auto-restart on end
//     this.recognition.onend = () => {
//       this.recognitionActive = false;

//       // Only restart if not playing audio
//       if (!this.isInterviewerSpeaking && !this.isPlayingAudio) {
//         this.startSpeechRecognition();
//       }
//     };

//     // Handle errors
//     this.recognition.onerror = (event: any) => {
//       console.error('Speech recognition error:', event.error);

//       if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
//         console.error('Microphone permission denied');
//         this.recognitionActive = false;
//       }
//     };
//   }

//   startSpeechRecognition() {
//     if (!this.recognition || this.recognitionActive) return;

//     try {
//       this.recognition.start();
//       this.recognitionActive = true;
//     } catch (e) {
//       // Already started
//       if (e instanceof Error && e.message.includes('already started')) {
//         this.recognitionActive = true;
//       }
//     }
//   }

//   stopSpeechRecognition() {
//     if (!this.recognition || !this.recognitionActive) return;

//     try {
//       this.recognition.stop();
//       this.recognitionActive = false;
//     } catch (e) {
//       console.error('Error stopping recognition:', e);
//     }
//   }

//   /* ================= SILENCE DETECTION ================= */

//   startSilenceWatcher() {
//     this.stopSilenceWatcher();
//     this.lastSpeechTime = Date.now();

//     // Check every 100ms for accurate silence detection
//     this.silenceWatcher = setInterval(() => {
//       const silenceDuration = Date.now() - this.lastSpeechTime;

//       if (silenceDuration >= this.SILENCE_LIMIT) {
//         this.stopSilenceWatcher();
//         this.goToNextQuestion();
//       }
//     }, 100);
//   }

//   stopSilenceWatcher() {
//     if (this.silenceWatcher) {
//       clearInterval(this.silenceWatcher);
//       this.silenceWatcher = null;
//     }
//   }

//   goToNextQuestion() {
//     if (this.currentIndex >= this.questions.length - 1) {
//       this.finishInterview();
//       return;
//     }

//     this.currentIndex++;
//     this.loadQuestion();
//     this.playQuestionAudio();
//   }

//   /* ================= MIC ================= */

//   async startMic() {
//     try {
//       this.micStream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true
//         }
//       });

//       this.micContext = new AudioContext();
//       const src = this.micContext.createMediaStreamSource(this.micStream);

//       this.micAnalyser = this.micContext.createAnalyser();
//       this.micAnalyser.fftSize = 256;

//       src.connect(this.micAnalyser);
//       this.drawVisualizer(this.micCanvas.ctx, this.micAnalyser);
//     } catch (err) {
//       console.error('Mic permission denied:', err);
//     }
//   }

//   finishInterview() {
//     this.stopSpeechRecognition();
//     this.stopSilenceWatcher();

//     const elements = [
//       'studentSection',
//       'startAudioBtn',
//       'studentSpeechText'
//     ];

//     elements.forEach(id => {
//       const el = document.getElementById(id);
//       if (el) el.style.display = 'none';
//     });

//     const done = document.getElementById('studentComplete');
//     if (done) done.style.display = 'block';

//     // Cleanup
//     this.micStream?.getTracks().forEach((t: any) => t.stop());
//     this.micContext?.close();
//     this.audioContext?.close();
//   }

//   /* ================= VISUALIZERS ================= */

//   makeVisualizer(id: string) {
//     const canvas: any = document.getElementById(id);
//     const ctx = canvas?.getContext('2d');

//     const resize = () => {
//       canvas.width = canvas.offsetWidth * devicePixelRatio;
//       canvas.height = canvas.offsetHeight * devicePixelRatio;
//       ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
//     };

//     resize();
//     window.addEventListener('resize', resize);

//     return { canvas, ctx };
//   }

//   drawVisualizer(ctx: any, analyser: any) {
//     if (!ctx || !analyser) return;

//     const dataArray = new Uint8Array(64);

//     const loop = () => {
//       requestAnimationFrame(loop);
//       analyser.getByteFrequencyData(dataArray);

//       ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//       const cx = ctx.canvas.width / devicePixelRatio / 2;
//       const cy = ctx.canvas.height / devicePixelRatio / 2;

//       const inner = 60;
//       const outer = 90;

//       for (let i = 0; i < dataArray.length; i++) {
//         const v = dataArray[i] / 255;
//         const angle = (Math.PI * 2 * i) / dataArray.length;

//         ctx.strokeStyle = `rgba(0,200,255,${0.4 + v * 0.6})`;
//         ctx.lineWidth = 4;
//         ctx.lineCap = 'round';

//         ctx.beginPath();
//         ctx.moveTo(
//           cx + Math.cos(angle) * inner,
//           cy + Math.sin(angle) * inner
//         );
//         ctx.lineTo(
//           cx + Math.cos(angle) * (inner + v * (outer - inner)),
//           cy + Math.sin(angle) * (inner + v * (outer - inner))
//         );
//         ctx.stroke();
//       }
//     };

//     loop();
//   }
// }