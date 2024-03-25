import { AfterViewInit, Directive, ElementRef, EventEmitter, Host, Input, OnChanges, Optional, Output, Renderer2, Self, SimpleChanges } from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { map, startWith } from 'rxjs'

@Directive({
  selector: '[nxtBubblePagination]',
  standalone: true
})
export class BubblePaginationDirective implements AfterViewInit, OnChanges {
  @Output() pageIndexChangeEmitter: EventEmitter<number> = new EventEmitter<number>()
  @Input() showFirstButton = true
  @Input() showLastButton = true
  @Input() renderButtonsNumber = 2
  @Input() appCustomLength: number = 0
  @Input() hideDefaultArrows = false

  private dotsEndRef!: HTMLElement
  private dotsStartRef!: HTMLElement
  private bubbleContainerRef!: HTMLElement
  private buttonsRef: HTMLElement[] = []

  constructor(@Host() @Self() @Optional() private readonly matPag: MatPaginator, private elementRef: ElementRef, private renderer: Renderer2) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.['appCustomLength']?.firstChange) {
      // remove buttons before creating new ones
      this.removeButtons()
      // switch back to page 0
      this.switchPage(0)
      this.renderButtons()
    }
  }

  ngAfterViewInit(): void {
    this.styleDefaultPagination()
    this.createBubbleDivRef()
  }

  private renderButtons(): void {
    // build buttons to UI
    this.buildButtons()

    // when pagination change -> change button styles
    this.matPag.page
      .pipe(
        map((e) => [e.previousPageIndex ?? 0, e.pageIndex]),
        startWith([0, 0])
        // takeUntilDestroyed() // <-- does not work
      )
      .subscribe(([prev, curr]) => {
        this.changeActiveButtonStyles(prev, curr)
      })
  }

  private changeActiveButtonStyles(previousIndex: number, newIndex: number) {
    const previouslyActive = this.buttonsRef[previousIndex]
    const currentActive = this.buttonsRef[newIndex]

    // remove active style from previously active button
    // console.log('renderer', this.renderer)
    // console.log('elementRef', this.elementRef)
    // console.log('previouslyActive', previouslyActive)

    this.renderer.removeClass(previouslyActive, 'nxt-bubble__active')

    // add active style to new active button
    this.renderer.addClass(currentActive, 'nxt-bubble__active')

    // hide all buttons
    this.buttonsRef.forEach((button) =>
      this.renderer.setStyle(button, 'display', 'none')
    )

    // show N previous buttons and X next buttons
    const renderElements = this.renderButtonsNumber
    const endDots = newIndex < this.buttonsRef.length - renderElements - 1
    const startDots = newIndex - renderElements > 0

    const firstButton = this.buttonsRef[0]
    const lastButton = this.buttonsRef[this.buttonsRef.length - 1]

    // last bubble and dots
    if (this.showLastButton) {
      this.renderer.setStyle(this.dotsEndRef, 'display', endDots ? 'block' : 'none')
      this.renderer.setStyle(lastButton, 'display', endDots ? 'flex' : 'none')
    }

    // first bubble and dots
    if (this.showFirstButton) {
      this.renderer.setStyle(
        this.dotsStartRef,
        'display',
        startDots ? 'block' : 'none'
      )
      this.renderer.setStyle(firstButton, 'display', startDots ? 'flex' : 'none')
    }

    // resolve starting and ending index to show buttons
    const startingIndex = startDots ? newIndex - renderElements : 0

    const endingIndex = endDots
      ? newIndex + renderElements
      : this.buttonsRef.length - 1

    // display starting buttons
    for (let i = startingIndex; i <= endingIndex; i++) {
      const button = this.buttonsRef[i]
      this.renderer.setStyle(button, 'display', 'flex')
    }
  }

  private styleDefaultPagination() {
    const nativeElement = this.elementRef.nativeElement
    const itemsPerPage = nativeElement.querySelector(
      '.mat-mdc-paginator-page-size'
    )
    const howManyDisplayedEl = nativeElement.querySelector(
      '.mat-mdc-paginator-range-label'
    )
    const previousButton = nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-previous'
    )
    const nextButtonDefault = nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-next'
    )

    // remove 'items per page'
    this.renderer.setStyle(itemsPerPage, 'display', 'none')

    // style text of how many elements are currently displayed
    this.renderer.setStyle(howManyDisplayedEl, 'position', 'absolute')
    this.renderer.setStyle(howManyDisplayedEl, 'left', '0')
    // this.renderer.setStyle(howManyDisplayedEl, 'color', '#919191')
    // this.renderer.setStyle(howManyDisplayedEl, 'font-size', '14px')

    // check whether the user wants to remove left & right default arrow
    if (this.hideDefaultArrows) {
      this.renderer.setStyle(previousButton, 'display', 'none')
      this.renderer.setStyle(nextButtonDefault, 'display', 'none')
    }
  }

  private createBubbleDivRef(): void {
    const actionContainer = this.elementRef.nativeElement.querySelector(
      'div.mat-mdc-paginator-range-actions'
    )
    const nextButtonDefault = this.elementRef.nativeElement.querySelector(
      'button.mat-mdc-paginator-navigation-next'
    )

    // create a HTML element where all bubbles will be rendered
    this.bubbleContainerRef = this.renderer.createElement('div') as HTMLElement
    this.renderer.addClass(this.bubbleContainerRef, 'nxt-bubble-container')

    // render element before the 'next button' is displayed
    this.renderer.insertBefore(
      actionContainer,
      this.bubbleContainerRef,
      nextButtonDefault
    )
  }

  private buildButtons(): void {
    const neededButtons = Math.ceil(
      this.appCustomLength / this.matPag.pageSize
    )

    // if there is only one page, do not render buttons
    if (neededButtons === 1) {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none')
      return
    }

    // create first button
    this.buttonsRef = [this.createButton(0)]

    // add dots (....) to UI
    this.dotsStartRef = this.createDotsElement()

    // create all buttons needed for navigation (except the first & last one)
    for (let index = 1; index < neededButtons - 1; index++) {
      this.buttonsRef = [...this.buttonsRef, this.createButton(index)]
    }

    // add dots (....) to UI
    this.dotsEndRef = this.createDotsElement()

    // create last button to UI after the dots (....)
    this.buttonsRef = [
      ...this.buttonsRef,
      this.createButton(neededButtons - 1),
    ]
  }

  private removeButtons(): void {
    this.buttonsRef.forEach((button) => {
      this.renderer.removeChild(this.bubbleContainerRef, button)
    })

    // Empty state array
    this.buttonsRef.length = 0
  }

  private createButton(i: number): HTMLElement {
    const bubbleButton = this.renderer.createElement('div')
    const text = this.renderer.createText(String(i + 1))

    // add class & text
    this.renderer.addClass(bubbleButton, 'nxt-bubble')
    this.renderer.setStyle(bubbleButton, 'margin-right', '8px')
    this.renderer.appendChild(bubbleButton, text)

    // react on click
    this.renderer.listen(bubbleButton, 'click', () => {
      this.switchPage(i)
    })

    // render on UI
    this.renderer.appendChild(this.bubbleContainerRef, bubbleButton)

    // set style to hidden by default
    this.renderer.setStyle(bubbleButton, 'display', 'none')

    return bubbleButton
  }

  private createDotsElement(): HTMLElement {
    const dotsEl = this.renderer.createElement('span')
    const dotsText = this.renderer.createText('.....')

    // add class
    this.renderer.setStyle(dotsEl, 'font-size', '18px')
    this.renderer.setStyle(dotsEl, 'margin-right', '8px')
    this.renderer.setStyle(dotsEl, 'padding-top', '6px')
    this.renderer.setStyle(dotsEl, 'color', '#919191')

    // append text to element
    this.renderer.appendChild(dotsEl, dotsText)

    // render dots to UI
    this.renderer.appendChild(this.bubbleContainerRef, dotsEl)

    // set style none by default
    this.renderer.setStyle(dotsEl, 'display', 'none')

    return dotsEl
  }

  private switchPage(i: number): void {
    const previousPageIndex = this.matPag.pageIndex
    this.matPag.pageIndex = i
    this.matPag['_emitPageEvent'](previousPageIndex)

    this.pageIndexChangeEmitter.emit(i)
  }
}
