import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { interviewService } from 'src/app/core/services/aiinterview.service';
import { interviewaudio } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aiinterview',
  templateUrl: './aiinterview.component.html',
  styleUrls: ['./aiinterview.component.css']
})

export class AiinterviewComponent implements OnInit, AfterViewInit, OnDestroy {

  currentIndex = 0;
  audioContext: any;

  questions: any[] = [];
  currentQuestion: any;

  Audiourl = '';

  micStream: any = null;
  micContext: any = null;
  micAnalyser: any = null;

  recognition: any;
  silenceTimer: any = null;
  SILENCE_LIMIT = 5000;

  audioCanvas: any;
  micCanvas: any;

  studentSpeech = "";
  speechBuffer = "";

  isFirstPlayDone = false;
  recognitionActive = false;
  isPlayingAudio = false;
  isRecognitionPaused = false;
  questionAudioCompleted = false;
  silenceTimerRunning = false;

  constructor(private router: Router, private _interviewService: interviewService) { }

  ngOnInit(): void {
    this._interviewService.getAiInterviewData().subscribe({
      next: (res) => {
        console.log('Interview API:', res);

        this.questions = res.data.data.questions;
        this.currentIndex = 0;
        this.currentQuestion = this.questions[this.currentIndex];
      },
      error: (err) => {
        console.error('Interview API error:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.audioCanvas = this.makeVisualizer('audioCanvas');
      this.micCanvas = this.makeVisualizer('micCanvas');
      this.startMic();
      this.initSpeechRecognition();
      this.startSpeechRecognition();
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopSpeechRecognition();
    if (this.micStream) this.micStream.getTracks().forEach((t: any) => t.stop());
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.micContext) this.micContext.close();
    if (this.audioContext) this.audioContext.close();
  }

  startInterview() {
    if (!this.questions.length) {
      console.warn('Questions not ready yet');
      return;
    }

    if (this.isFirstPlayDone) return;

    this.isFirstPlayDone = true;
    this.loadQuestion();
    this.startAudio();
  }

  loadQuestion() {
    this.currentQuestion = this.questions[this.currentIndex];

    const category = this.currentQuestion.category;
    const qid = this.currentQuestion.id;

    this.Audiourl = `${interviewaudio}/app/Assets/AI-Interview/${category}/${qid}.mp3`;

    console.log('Audio URL:', this.Audiourl
    );
  }

  startAudio() {
    this.loadQuestion();
    this.isPlayingAudio = true;
    this.pauseSpeechRecognition();

    if (!this.audioContext)
      this.audioContext = new AudioContext();

    const audio = new Audio(this.Audiourl
    );
    audio.crossOrigin = "anonymous";

    const src = this.audioContext.createMediaElementSource(audio);
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;

    src.connect(analyser);
    analyser.connect(this.audioContext.destination);

    this.drawVisualizer(this.audioCanvas.ctx, analyser);
    this.studentSpeech = "";
    this.speechBuffer = "";

    audio.play();

    audio.onended = () => {
      this.isPlayingAudio = false;
      this.questionAudioCompleted = true;

      this.resumeSpeechRecognition();

      this.startSilenceTimer();
    };


    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      this.isPlayingAudio = false;
      this.resumeSpeechRecognition();
    };
  }

  async startMic() {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.micContext = new AudioContext();
      const src = this.micContext.createMediaStreamSource(this.micStream);

      this.micAnalyser = this.micContext.createAnalyser();
      this.micAnalyser.fftSize = 256;

      src.connect(this.micAnalyser);

      this.drawVisualizer(this.micCanvas.ctx, this.micAnalyser);

    } catch (err) {
      console.error("Mic permission denied:", err);
    }
  }

  initSpeechRecognition() {
    const Speech =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!Speech) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    this.recognition = new Speech();
    this.recognition.lang = "en-US";
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.interimResults = false;
    if (this.recognition.grammars) {
    }
  }

  startSpeechRecognition() {
    if (this.recognitionActive || !this.recognition) return;

    this.recognitionActive = true;
    this.isRecognitionPaused = false;

    this.recognition.onresult = (event: any) => {
      if (this.isRecognitionPaused) return;

      let finalText = this.speechBuffer;
      let gotNewText = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];

        if (res.isFinal) {
          const text = res[0].transcript.trim();
          if (text) {
            finalText += text + " ";
            this.speechBuffer = finalText;
            gotNewText = true;
          }
        }
      }

      if (gotNewText) {
        this.studentSpeech = this.speechBuffer.trim();
        if (this.questionAudioCompleted) {
        }
      }

    };

    this.recognition.onresult = (event: any) => {
      if (!this.questionAudioCompleted) return;

      let gotText = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          if (text) {
            this.speechBuffer += text + ' ';
            gotText = true;
          }
        }
      }

      if (gotText) {
        this.studentSpeech = this.speechBuffer.trim();
        this.resetSilenceTimer();
      }
    };


    this.recognition.onend = () => {
      if (!this.isRecognitionPaused && this.currentIndex < this.questions.length) {
        setTimeout(() => {
          try {
            this.recognition.start();
            this.recognitionActive = true;
          } catch { }
        }, 200);
      }
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  }

  pauseSpeechRecognition() {
    if (this.recognition && this.recognitionActive) {
      try {
        this.recognition.stop();
        this.isRecognitionPaused = true;
        console.log("Speech recognition paused");
      } catch (err) {
        console.error("Error pausing speech recognition:", err);
      }
    }
  }

  resumeSpeechRecognition() {
    if (this.recognition && this.isRecognitionPaused) {
      setTimeout(() => {
        try {
          this.recognition.start();
          this.recognitionActive = true;
          this.isRecognitionPaused = false;
          console.log("Speech recognition resumed");
        } catch (err) {
          console.error("Error resuming speech recognition:", err);
        }
      }, 200);
    }
  }

  stopSpeechRecognition() {
    if (this.recognition) {
      try {
        this.recognition.stop();
        this.recognitionActive = false;
        this.isRecognitionPaused = false;
      } catch { }
    }
  }

  startSilenceTimer() {
    if (this.silenceTimerRunning) return;
    if (!this.questionAudioCompleted) return;

    this.silenceTimerRunning = true;

    this.silenceTimer = setTimeout(() => {
      this.silenceTimerRunning = false;
      this.goToNextQuestion();
    }, this.SILENCE_LIMIT);
  }

  resetSilenceTimer() {
    if (!this.silenceTimerRunning) return;

    clearTimeout(this.silenceTimer);

    this.silenceTimer = setTimeout(() => {
      this.silenceTimerRunning = false;
      this.goToNextQuestion();
    }, this.SILENCE_LIMIT);
  }

  goToNextQuestion() {
    if (this.currentIndex === this.questions.length - 1) {
      this.finishInterview();
      return;
    }

    this.currentIndex++;

    this.studentSpeech = '';
    this.speechBuffer = '';

    clearTimeout(this.silenceTimer);
    this.silenceTimerRunning = false;
    this.questionAudioCompleted = false;

    this.loadQuestion();
    this.startAudio();
  }

  finishInterview() {
    this.stopSpeechRecognition();
    const student = document.getElementById("studentSection");
    if (student) student.style.display = "none";

    const btn = document.getElementById("startAudioBtn");
    if (btn) btn.style.display = "none";

    const speechBox = document.getElementById("studentSpeechText");
    if (speechBox) speechBox.style.display = "none";

    if (this.micStream)
      this.micStream.getTracks().forEach((t: any) => t.stop());

    if (this.micContext) this.micContext.close();
    if (this.audioContext) this.audioContext.close();

    if (this.silenceTimer) clearTimeout(this.silenceTimer);

    const done = document.getElementById("studentComplete");
    if (done) done.style.display = "block";
  }

  makeVisualizer(id: string) {
    const canvas: any = document.getElementById(id);
    if (!canvas) {
      console.error(`Canvas with id ${id} not found`);
      return { canvas: null, ctx: null };
    }

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    return { canvas, ctx };
  }

  drawVisualizer(ctx: any, analyser: any) {
    if (!ctx || !analyser) return;

    const dataArray = new Uint8Array(64);

    const loop = () => {
      requestAnimationFrame(loop);

      if (!analyser) return;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const cx = ctx.canvas.width / devicePixelRatio / 2;
      const cy = ctx.canvas.height / devicePixelRatio / 2;

      const inner = 60;
      const outer = 80;
      const bars = 64;
      const slice = (Math.PI * 2) / bars;

      for (let i = 0; i < bars; i++) {
        const v = dataArray[i] / 255;
        const len = inner + v * (outer - inner);
        const angle = slice * i;

        const x0 = cx + Math.cos(angle) * inner;
        const y0 = cy + Math.sin(angle) * inner;
        const x1 = cx + Math.cos(angle) * len;
        const y1 = cy + Math.sin(angle) * len;

        ctx.strokeStyle = `rgba(0,200,255,${0.4 + v * 0.6})`;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    };

    loop();
  }

}