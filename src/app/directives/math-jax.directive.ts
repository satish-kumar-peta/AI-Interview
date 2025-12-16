import { Directive,ElementRef,Input} from '@angular/core';

@Directive({
  selector: '[appMathJax]'
})
export class MathJaxDirective {
  @Input('appMathJax') MathJaxInput: string;
  constructor(private el: ElementRef) 
  {

  }
   ngOnChanges() {
     this.el.nativeElement.innerHTML = this.MathJaxInput;
     //console.log(this.MathJaxInput);
    eval('MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.el.nativeElement.innerHTML])');
    eval('MathJax.Hub.Queue(["Typeset", MathJax.Hub])');
  }

}
