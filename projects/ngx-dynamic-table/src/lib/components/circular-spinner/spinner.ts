import { Component, Input } from '@angular/core'

export const normalizeSize = (size: number | string) => (parseFloat(size.toString()).toString() === size.toString() ? `${size}px` : size.toString())

/**
 * This is an abstract class representing the spinner options.
 * Subclasses should implement methods to work with.
 */
@Component({
    template: ''
})
export abstract class SpinnerComponent {
    /**
     * Default color of the spinner.
     * @type {string}
     */
    @Input() color = '#037bfc'
    /**
     * Default secondary color of the spinner.
     * @type {string}
     */
    @Input() secondaryColor = 'rgba(0,0,0,0.05)'
    /**
     * Default enabled of the spinner.
     * @type {string}
     */
    @Input() enabled = true
    /**
     * Default size of the spinner.
     * @type {string}
     */
    @Input() size: number | string = 50
    /**
     * Default speed of the spinner.
     * @type {string}
     */
    @Input() speed = 100
    /**
     * Default still of the spinner.
     * @type {string}
     */
    @Input() still = false
    /**
     * Default style of the spinner.
     * @type {string}
     */
    @Input() styles = {}
    /**
     * Default stroke thickness of the spinner.
     * @type {string}
     */
    @Input() thickness = 160

    /**
     * This method should be implemented by the subclass.
     * @returns {Object}
     */
    get svgStyle() {
        return {
            color: this.color,
            overflow: 'visible',
            width: normalizeSize(this.size),
            height: normalizeSize(this.size),
            ...(typeof this.styles === 'string' ? JSON.parse(this.styles) : this.styles)
        }
    }
}