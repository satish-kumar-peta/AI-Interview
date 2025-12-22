import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css']
})

export class InstructionComponent {

  constructor(private router: Router) { }

  AIInterview() {
    this.router.navigate(['/student/aiinterview']);
  }
}
