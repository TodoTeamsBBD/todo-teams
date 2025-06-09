import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pin-input',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pin-input.html',
  styleUrl: './pin-input.css'
})
export class PinInput {
  @Input() length: number = 6;
  @Input() hasError: boolean = false;
  @Input() errorMessage: string = '';
  @Input() autoFocus: boolean = true;

  @Output() pinComplete = new EventEmitter<string>();
  @Output() pinChange = new EventEmitter<string>();
  @Output() pinClear = new EventEmitter<void>();

  @ViewChild('pinInput') pinInputRef!: ElementRef;

  pinValue: string = '';

  get placeholder(): string {
    return '•'.repeat(this.length);
  }

  ngAfterViewInit() {
    if (this.autoFocus) {
      setTimeout(() => {
        this.pinInputRef.nativeElement.focus();
      }, 0);
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Only allow digits
    value = value.replace(/\D/g, '');

    // Limit to specified length
    if (value.length > this.length) {
      value = value.substring(0, this.length);
    }

    this.pinValue = value;
    input.value = value;

    this.pinChange.emit(value);

    // Check if PIN is complete
    if (value.length === this.length) {
      this.pinComplete.emit(value);
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true)) {
      return;
    }

    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }

  // Public methods for external control
  clear() {
    this.pinValue = '';
    this.pinClear.emit();
    if (this.pinInputRef) {
      this.pinInputRef.nativeElement.focus();
    }
  }

  setValue(value: string) {
    const cleanValue = value.replace(/\D/g, '').substring(0, this.length);
    this.pinValue = cleanValue;
    this.pinChange.emit(cleanValue);

    if (cleanValue.length === this.length) {
      this.pinComplete.emit(cleanValue);
    }
  }

  getValue(): string {
    return this.pinValue;
  }
}
