import { Injectable, TemplateRef } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ExpandTemplateService {

  expand_templates: any = {}

  add(name: string, ref: TemplateRef<any>) {
    this.expand_templates[name] = ref
  }
  
  get(name: string) {
    return this.expand_templates[name]
  }
}