import { Directive, OnInit, ElementRef, Input, Inject, PLATFORM_ID } from '@angular/core'
import { DOCUMENT } from '@angular/common'

@Directive({
  selector: '[sticky]',
  standalone: true
})
export class StickyDirective implements OnInit {

  @Input()
  get scrollContainer(): string | ElementRef | HTMLElement {
    return this._scrollContainer
  }
  set scrollContainer(value: string | ElementRef | HTMLElement) {
    this.setHTMLElement('_scrollContainer', value)
  }
  private _scrollContainer!: HTMLElement

  @Input() zIndex = 10
  @Input() top = 0

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private stickyElement: ElementRef
  ) {}

  ngOnInit(): void {
    this.makeSticky()
  }

  private setHTMLElement(
    prop: string,
    value: string | ElementRef | HTMLElement
  ): void {
    if (typeof value === 'string') {
      this['_scrollContainer'] = this.document.getElementById(value)!
    } else if (value instanceof ElementRef) {
      this['_scrollContainer'] = value.nativeElement!
    } else {
      this['_scrollContainer'] = value
    }
  }

  private makeSticky() {
    const nativeElement: HTMLElement = this.stickyElement.nativeElement

    this.setStylePropertyToElement(nativeElement, 'position', '-webkit-sticky')
    this.setStylePropertyToElement(nativeElement, 'position', 'sticky')
    this.setStylePropertyToElement(nativeElement, 'top', `${this.top}px`)
    this.setStylePropertyToElement(nativeElement, 'zIndex', this.zIndex.toString())
  }

  private setStylePropertyToElement(
    nativeEl: HTMLElement,
    property: keyof CSSStyleDeclaration,
    value: string
  ) {
    nativeEl.style[property.toString() as any] = value
  }
}
