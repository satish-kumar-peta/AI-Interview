import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import { interviewService } from 'src/app/core/services/aiinterview.service';
import { interviewaudio } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aiinterview',
  templateUrl: './aiinterview.component.html',
  styleUrls: ['./aiinterview.component.css']
})
export class AiinterviewComponent
  implements OnInit, AfterViewInit, OnDestroy {

  /* ---------------- DATA ---------------- */
  questions: any[] = [];
  currentIndex = 0;
  currentQuestion: any;

  Audiourl = '';

  /* ---------------- FLAGS ---------------- */
  isInterviewerSpeaking = false;
  isPlayingAudio = false;
  isFirstPlayDone = false;
  questionAudioCompleted = false;

  /* ---------------- SPEECH ---------------- */
  recognition: any;
  recognitionActive = false;

  studentSpeech = '';
  finalTranscript = ''; // ✅ FIX

  /* ---------------- SILENCE ---------------- */
  lastSpeechTime = 0;
  silenceWatcher: any;
  SILENCE_LIMIT = 5000;

  /* ---------------- AUDIO ---------------- */
  audioContext: AudioContext | null = null;

  /* ---------------- VISUALS ---------------- */
  audioCanvas: any;
  micCanvas: any;

  /* ---------------- MIC ---------------- */
  micStream: any = null;
  micContext: AudioContext | null = null;
  micAnalyser: any = null;

  constructor(
    private router: Router,
    private _interviewService: interviewService,
    private zone: NgZone
  ) {}

  /* ================= INIT ================= */

  ngOnInit(): void {
    this._interviewService.getAiInterviewData().subscribe({
      next: (res) => {
        this.questions = res?.data?.data?.questions || [];
        this.currentIndex = 0;
        this.currentQuestion = this.questions[0];
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
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopSpeechRecognition();

    this.micStream?.getTracks().forEach((t: any) => t.stop());
    this.micContext?.close();
    this.audioContext?.close();
  }

  /* ================= INTERVIEW FLOW ================= */

  startInterview() {
    if (!this.questions.length || this.isFirstPlayDone) return;

    this.isFirstPlayDone = true;

    if (!this.audioContext)
      this.audioContext = new AudioContext();

    if (this.audioContext.state === 'suspended')
      this.audioContext.resume();

    this.loadQuestion();
    this.playQuestionAudio();
  }

  loadQuestion() {
    this.currentQuestion = this.questions[this.currentIndex];
    const { category, id } = this.currentQuestion;

    this.Audiourl =
      `${interviewaudio}/app/Assets/AI-Interview/${category}/${id}.mp3`;
  }

  playQuestionAudio() {
    this.stopSilenceWatcher();
    this.stopSpeechRecognition();

    this.isInterviewerSpeaking = true;
    this.isPlayingAudio = true;

    // ✅ RESET TRANSCRIPTS
    this.finalTranscript = '';
    this.studentSpeech = '';

    const audio = new Audio(this.Audiourl);
    audio.crossOrigin = 'anonymous';

    const src = this.audioContext!.createMediaElementSource(audio);
    const analyser = this.audioContext!.createAnalyser();
    analyser.fftSize = 256;

    src.connect(analyser);
    analyser.connect(this.audioContext!.destination);

    this.drawVisualizer(this.audioCanvas.ctx, analyser);

    audio.play();

    audio.onended = () => {
      this.zone.run(() => {
        this.isInterviewerSpeaking = false;
        this.isPlayingAudio = false;
        this.questionAudioCompleted = true;

        this.startSpeechRecognition();
        this.startSilenceWatcher();
      });
    };
  }

  /* ================= SPEECH ================= */

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

    // 🔥 FIXED LOGIC
    this.recognition.onresult = (event: any) => {
      if (this.isInterviewerSpeaking) return;

      this.zone.run(() => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            this.finalTranscript += text + ' ';
          } else {
            interimTranscript += text;
          }
        }

        // ✅ ONLY FINAL + CURRENT INTERIM
        this.studentSpeech =
          (this.finalTranscript + interimTranscript).trim();

        this.lastSpeechTime = Date.now();
      });
    };

    this.recognition.onend = () => {
      if (this.recognitionActive && !this.isInterviewerSpeaking) {
        setTimeout(() => {
          try {
            this.recognition.start();
          } catch {}
        }, 200);
      }
    };
  }

  startSpeechRecognition() {
    if (!this.recognition || this.recognitionActive) return;

    try {
      this.recognition.start();
      this.recognitionActive = true;
    } catch {}
  }

  stopSpeechRecognition() {
    try {
      this.recognition.stop();
      this.recognitionActive = false;
    } catch {}
  }

  /* ================= SILENCE ================= */

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
    if (this.currentIndex >= this.questions.length - 1) {
      this.finishInterview();
      return;
    }

    this.currentIndex++;
    this.loadQuestion();
    this.playQuestionAudio();
  }

  /* ================= MIC ================= */

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

  /* ================= FINISH ================= */

  finishInterview() {
    this.stopSpeechRecognition();

    this.micStream?.getTracks().forEach((t: any) => t.stop());
    this.micContext?.close();
    this.audioContext?.close();

    const done = document.getElementById('studentComplete');
    if (done) done.style.display = 'block';
  }

  /* ================= VISUALIZER ================= */

  makeVisualizer(id: string) {
    const canvas: any = document.getElementById(id);
    const ctx = canvas?.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    return { canvas, ctx };
  }

  drawVisualizer(ctx: any, analyser: any) {
    if (!ctx || !analyser) return;

    const dataArray = new Uint8Array(64);

    const loop = () => {
      requestAnimationFrame(loop);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const cx = ctx.canvas.width / devicePixelRatio / 2;
      const cy = ctx.canvas.height / devicePixelRatio / 2;

      const inner = 60;
      const outer = 90;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 255;
        const angle = (Math.PI * 2 * i) / dataArray.length;

        ctx.strokeStyle = `rgba(0,200,255,${0.4 + v * 0.6})`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(
          cx + Math.cos(angle) * inner,
          cy + Math.sin(angle) * inner
        );
        ctx.lineTo(
          cx + Math.cos(angle) * (inner + v * (outer - inner)),
          cy + Math.sin(angle) * (inner + v * (outer - inner))
        );
        ctx.stroke();
      }
    };

    loop();
  }
}
