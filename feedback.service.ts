import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Feedback } from './entity/feedback'; // import Observable to solve build issue
import domToImage from 'dom-to-image';

@Injectable()
export class FeedbackService {
  public initialVariables: object = {};
  public highlightedColor = 'yellow';
  public hiddenColor = 'black';
  private screenshotImageSource = new Subject<any>();
  public screenshotImage$: Observable<any> = this.screenshotImageSource.asObservable();

  private feedbackSource = new Subject<Feedback>();
  public feedback$: Observable<Feedback> = this.feedbackSource.asObservable();

  private isDraggingToolbarSource = new Subject<boolean>();
  public isDraggingToolbar$: Observable<boolean> = this.isDraggingToolbarSource.asObservable();

  public initScreenshotCanvas() {
    const that = this;
    /**
     * 스크린샷하는 부분의 노드들을 돌며, 캡쳐를 무시할 id 를 정하고 캡쳐
     * 1. 캡쳐도구 dialog 를 무시
     */
    const captureArea = document.body;
    domToImage.toPng(captureArea, {
        filter: node => node.id !== 'dialog'
      })
      .then(function(dataUrl) {
        const img = new Image();
        img.src = dataUrl;
        that.screenshotImageSource.next(img);
      });

  }

  public setCanvas(canvas: HTMLCanvasElement): void {
    this.screenshotImageSource.next(canvas);
  }

  public setFeedback(feedback: Feedback): void {
    this.feedbackSource.next(feedback);
  }

  public setIsDraggingToolbar(isDragging: boolean): void {
    this.isDraggingToolbarSource.next(isDragging);
  }

  public getImgEle(image): HTMLElement {
    Object.assign(image.style, {
      position: 'absolute',
      top: '50%',
      right: '0',
      left: '0',
      margin: '0 auto',
      maxHeight: '100%',
      maxWidth: '100%',
      transform: 'translateY(-50%)'
    });
    return image;
  }

  public hideBackDrop() {
    const dialogBackDrop = document.getElementsByClassName('dialogBackDrop')[0] as HTMLElement;
    dialogBackDrop.style.backgroundColor = 'initial';
  }

  public showBackDrop() {
    const dialogBackDrop = document.getElementsByClassName('dialogBackDrop')[0] as HTMLElement;
    if (!dialogBackDrop.getAttribute('data-html2canvas-ignore')) {
      dialogBackDrop.setAttribute('data-html2canvas-ignore', 'true');
    }
    dialogBackDrop.style.backgroundColor = 'rgba(0, 0, 0, .288)';
  }
}
