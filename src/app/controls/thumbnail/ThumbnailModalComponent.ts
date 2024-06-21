import { Component, EventEmitter, Input, Output } from "@angular/core";


@Component({
    selector: 'app-thumbnail-modal',
    templateUrl: './thumbnailModalComponent.html',
    styleUrls: ['./thumbnailModalComponent.scss']
})
export class ThumbnailModalComponent {
    @Input() base64Images: Array<{ value1: any, value2: any }> = [];
    @Output() selectionChange = new EventEmitter<Array<{ value1: any, value2: any }>>();

    selectedImages: { [key: number]: boolean } = {};

  
    ngOnInit(): void {
        console.log(this.selectedImages);
    }  
    toggleSelection(index: number) {
      this.selectedImages[index] = !this.selectedImages[index];
      this.emitSelection();
    }
  
    emitSelection() {
      const selected = this.base64Images.filter((_, index) => this.selectedImages[index]);
      this.selectionChange.emit(selected);
    }
}
