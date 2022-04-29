import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

// this is an implementation of an Angular/forms/AsyncValidator
// [key: string] does not mean an array, it means its a dynamic property with any name that is a string, the value of the property could be anything (any)
// this makes the function generic, it can handle any input
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = new Observable((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4); //this is what allows us to read the mime-type
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16); //this will convert the array value to hex
      }
      switch (header) {
        case '89504e47': // PNG file format
          isValid = true;
          break;
        case 'ffd8ffe0': // 0-3 are all JPEG versions
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8': // SPIFF file format
          isValid = true;
          break;
        default: // Or you can use the blob.type as fallback
          isValid = false;
          break;
      }
      if (isValid) {
        observer.next(null); // return null if valid
      } else {
        observer.next({ invalidMimeType: true }); // since our Observable return type is generic, we can return anything we want here
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
};
