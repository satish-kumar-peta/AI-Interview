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

  questions: any[] = [];
  currentIndex = 0;
  currentQuestion: any;
  Audiourl = '';
  isInterviewerSpeaking = false;


  audioContext: any;

  recognition: any;
  recognitionActive = false;

  studentSpeech = '';

  lastSpeechTime = 0;
  silenceWatcher: any;
  SILENCE_LIMIT = 5000;

  audioCanvas: any;
  micCanvas: any;

  micStream: any = null;
  micContext: any = null;
  micAnalyser: any = null;

  // 🔥 IMPORTANT FLAG
  isAudioTriggeredByUser = false;
  speechBuffer: string;
  questionAudioCompleted: boolean;
  isPlayingAudio: boolean;
  isFirstPlayDone: any;

  constructor(
    private router: Router,
    private _interviewService: interviewService
  ) { }

  /* ---------------- INIT ---------------- */
  ngOnInit(): void {
    this._interviewService.getAiInterviewData().subscribe({
      next: (res) => {
        this.questions = res.data.data.questions || [];
        this.currentIndex = 0;
        this.currentQuestion = this.questions[this.currentIndex];
      },
      error: (err) => console.error('Interview API error:', err)
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.audioCanvas = this.makeVisualizer('audioCanvas');
      this.micCanvas = this.makeVisualizer('micCanvas');

      this.startMic();
      this.initSpeechRecognition();
      this.startSpeechRecognition();

      // ❌ NO AUTO AUDIO PLAY HERE

    }, 100);
  }

  ngOnDestroy(): void {
    this.stopSpeechRecognition();

    if (this.micStream)
      this.micStream.getTracks().forEach((t: any) => t.stop());

    if (this.micContext) this.micContext.close();
    if (this.audioContext) this.audioContext.close();
  }

  /* ---------------- INTERVIEW FLOW ---------------- */
  startInterview() {
    if (!this.questions.length) {
      console.warn('Questions not ready yet');
      return;
    }

    if (this.isFirstPlayDone) return;

    this.isFirstPlayDone = true;

    // 🔥 IMPORTANT: unlock audio context
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    this.loadQuestion();
    this.startAudio();
  }

  startAudio() {
    this.loadQuestion();
    this.isPlayingAudio = true;
    this.stopSpeechRecognition();

    if (!this.audioContext)
      this.audioContext = new AudioContext();

    // 🔥 THIS LINE IS THE KEY FOR WAVES
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const audio = new Audio(this.Audiourl);
    audio.crossOrigin = "anonymous";

    const src = this.audioContext.createMediaElementSource(audio);
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;

    src.connect(analyser);
    analyser.connect(this.audioContext.destination);

    // 🔥 INTERVIEWER AUDIO WAVES
    this.drawVisualizer(this.audioCanvas.ctx, analyser);

    this.studentSpeech = "";
    this.speechBuffer = "";

    audio.play();

    audio.onended = () => {
      this.isPlayingAudio = false;
      this.questionAudioCompleted = true;
      this.stopSpeechRecognition();
      this.startSilenceWatcher();
    };
  }

  loadQuestion() {
    this.currentQuestion = this.questions[this.currentIndex];
    const { category, id } = this.currentQuestion;

    this.Audiourl =
      `${interviewaudio}/app/Assets/AI-Interview/${category}/${id}.mp3`;
  }

  playAudio() {
    this.stopSilenceWatcher();

    if (!this.audioContext)
      this.audioContext = new AudioContext();

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume(); // 🔥 unlock
    }

    const audio = new Audio(this.Audiourl);
    audio.crossOrigin = 'anonymous';

    const src = this.audioContext.createMediaElementSource(audio);
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;

    src.connect(analyser);
    analyser.connect(this.audioContext.destination);

    this.drawVisualizer(this.audioCanvas.ctx, analyser);

    this.studentSpeech = '';
    audio.play();

    audio.onended = () => {
      this.startSilenceWatcher();
    };
  }

  initSpeechRecognition() {
    const Speech =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!Speech) return;

    this.recognition = new Speech();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {

      if (this.isInterviewerSpeaking) return; // 🔥 IGNORE interviewer audio

      let liveText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        liveText += event.results[i][0].transcript;
      }

      if (liveText.trim()) {
        this.studentSpeech = liveText.trim();
        this.lastSpeechTime = Date.now();
      }
    };

    this.recognition.onend = () => {
      if (this.recognitionActive) {
        setTimeout(() => this.recognition.start(), 200);
      }
    };
  }

  startSpeechRecognition() {
    if (this.recognitionActive) return;
    try {
      this.recognition.start();
      this.recognitionActive = true;
    } catch { }
  }

  stopSpeechRecognition() {
    try {
      this.recognition.stop();
      this.recognitionActive = false;
    } catch { }
  }

  /* ---------------- SILENCE LOGIC ---------------- */
  startSilenceWatcher() {
    this.lastSpeechTime = Date.now();

    this.silenceWatcher = setInterval(() => {
      const diff = Date.now() - this.lastSpeechTime;

      if (diff >= this.SILENCE_LIMIT) {
        this.stopSilenceWatcher();
        this.goToNextQuestion();
      }
    }, 500);
  }

  stopSilenceWatcher() {
    if (this.silenceWatcher) {
      clearInterval(this.silenceWatcher);
      this.silenceWatcher = null;
    }
  }

  goToNextQuestion() {
    if (this.currentIndex === this.questions.length - 1) {
      this.finishInterview();
      return;
    }

    this.currentIndex++;
    this.studentSpeech = '';
    this.loadQuestion();

    if (this.isAudioTriggeredByUser) {
      this.playAudio();
    }
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
      console.error('Mic permission denied:', err);
    }
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