import { Injector, Pipe, PipeTransform, Type } from '@angular/core'

/**
 * This pipe injects a individual pipe with optional arguments!
 */
@Pipe({
  name: 'dynamicPipe',
  standalone: true
})
export class DynamicPipe implements PipeTransform {
  /**
   * Creates an instance of DynamicPipe.
   * @param {Injector} injector - The injector to inject a individual pipe.
   */
  constructor(private injector: Injector) {}
  /**
   * This function returns a value, thats sliced.
   * @param {any}       value         - value that should be transformed
   * @param {Type<any>} requiredPipe  - Required pipe
   * @param {any}       pipeArgs      - Arguments for the pipe.
   */
  transform(value: any, requiredPipe: Type<any>, pipeArgs: any): any {
    const injector = Injector.create({
      name: 'DynamicPipe',
      parent: this.injector,
      providers: [
        { provide: requiredPipe }
      ]
    })
    const pipe = injector.get(requiredPipe)
    return pipe.transform(value, pipeArgs)
  }
}