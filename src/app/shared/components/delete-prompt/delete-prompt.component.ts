import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-delete-prompt',
  templateUrl: './delete-prompt.component.html',
  styleUrls: ['./delete-prompt.component.scss']
})
export class DeletePromptComponent implements OnInit {

  @Input() title: string = 'Delete';
  @Input() message: string = 'Are you sure you want to delete this?';

  constructor(protected ref: NbDialogRef<DeletePromptComponent>) {}

  ngOnInit(): void {}

  close(confirmed?: boolean) {
    this.ref.close(confirmed);
  }
}
