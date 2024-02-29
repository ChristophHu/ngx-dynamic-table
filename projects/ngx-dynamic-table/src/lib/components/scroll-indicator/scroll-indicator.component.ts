import { NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'scroll-indicator',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './scroll-indicator.component.html',
  styleUrls: ['./scroll-indicator.component.sass']
})
export class ScrollIndicatorComponent implements OnInit {
  @Input() scrollableContent: any
  @Input() distance: number = 16
  @Input() set change(value: Observable<boolean>) {
    value.subscribe({
      next: () => {
        this.checkScrollableContent()
      }
    })
  }

  isScrollIndicatorShown: boolean = false
  isScrollAtBottom: boolean = false

  @HostListener("window:resize", []) public onResize() {
    this.checkScrollableContent()
  }

  @HostListener('window:scroll', []) scroll() {
    console.log('update')
    if ((this.scrollableContent.scrollHeight - (this.scrollableContent.scrollTop + this.scrollableContent.offsetHeight)) <= 0) this.isScrollAtBottom = true
    if (this.scrollableContent.scrollTop <= 0) this.isScrollAtBottom = false
  }
  
  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      if (this.scrollableContent.scrollHeight > this.scrollableContent.offsetHeight) {
        this.isScrollIndicatorShown = true
      } else {
        this.isScrollIndicatorShown = false
      }
    }, 100)
  }

  checkScrollableContent() {
    setTimeout(() => {
      if (this.scrollableContent.scrollHeight > this.scrollableContent.offsetHeight) {
        this.isScrollIndicatorShown = true
      } else {
        this.isScrollIndicatorShown = false
      }
    }, 100)
  }

  public scrollToTop(): void {
    this.scrollableContent.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
    this.isScrollAtBottom = false
  }

  public scrollToBottom(): void {
    this.scrollableContent.scroll({
      top: this.scrollableContent.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
    this.isScrollAtBottom = true
  }
}
