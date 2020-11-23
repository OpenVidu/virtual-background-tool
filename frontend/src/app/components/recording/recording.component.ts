import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalRecorder, LocalRecorderState, OpenVidu, Publisher } from 'openvidu-browser';
import { Behaviour, Distance, Position, UserData } from 'src/app/interfaces/user-data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css']
})
export class RecordingComponent implements OnInit, OnDestroy, AfterViewInit {

  RECORDING_TIME = 4;
  OV: OpenVidu;
  publisher: Publisher;
  localRecorder: LocalRecorder;
  caseToShow;
  index = 0;
  recordingProgress = 0;
  recorderState = LocalRecorderState;
  canContinue = false;
  emailSent = false;
  videoPreview: HTMLVideoElement;

  recordingCases = [
    {
      id: 0,
      title: 'Recording the background',
      subtitle: '',
      text: ['First of all we are going to <strong>record only the background, without you</strong>.', 'The background has to be static, without changing chair positions or showing any shadows, but it can be any background, not just a simple color like the example and have as many details and items like frames or wardrobes on it.'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/background.png',
      record: true,
      time: 4
    },
    // **** STANDING ****
    {
      id: 1,
      title: 'Recording <strong>STANDING</strong>',
      subtitle: 'Right now we are going to record several videos with and without phones with different situations. <br><br> I know, it is a bit tiring, but consider that you are contributing to an amazing research field and helping to create software with better features',
      text: ['Camera distances: FAR, MEDIUM, NEAR', 'Positions: FRONT, HEAD TILTED and TILTED', 'Behaviour: <strong>STANDING</strong> ', 'Don’t worry, we are going to guide you through the process step by step.'],
      imageText: 'Your video should look like the following one:',
      image: '',
      record: false
    },

    // WITHOUT HEADPHONES
    // --- FAR ---
    {
      id: 2,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>FAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farFrontStanding.gif',
      record: true,
      distance: Distance.FAR,
      position: Position.FRONT,
      behaviour: Behaviour.STANDING,
      headphones: false,
      time: 4
    },
    {
      id: 3,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>FAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farHeadTiltedStanding.gif',
      record: true,
      distance: Distance.FAR,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: false,
      time: 4
    },
    {
      id: 4,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>FAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.FAR,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: false,
    },
    // --- MEDIUM ---
    {
      id: 5,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumFrontStanding.gif',
      record: true,
      time: 4,
      distance: Distance.MEDIUM,
      position: Position.FRONT,
      behaviour: Behaviour.STANDING,
      headphones: false,
    },
    {
      id: 6,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumHeadTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.MEDIUM,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: false,
    },
    {
      id: 7,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.MEDIUM,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: false,
    },
    // --- NEAR ---
    {
      id: 8,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>NEAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearFrontStanding.gif',
      record: true,
      time: 4,
      distance: Distance.CLOSE,
      position: Position.FRONT,
      behaviour: Behaviour.STANDING,
      headphones: false,
    },
    {
      id: 9,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>NEAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearHeadTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.CLOSE,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: false,
    },
    {
      id: 10,
      title: 'Recording <strong>WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>NEAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.CLOSE,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: false,
    },
    // WITH HEADPHONES
    // --- FAR ---
    {
      id: 2,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>FAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farFrontStanding.gif',
      record: true,
      time: 4,
      distance: Distance.FAR,
      position: Position.FRONT,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    {
      id: 4,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>FAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farHeadTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.FAR,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    {
      id: 4,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>FAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.FAR,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    // --- MEDIUM ---
    {
      id: 5,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumFrontStanding.gif',
      record: true,
      time: 4,
      distance: Distance.MEDIUM,
      position: Position.FRONT,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    {
      id: 6,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumHeadTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.MEDIUM,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    {
      id: 7,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.MEDIUM,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    // --- NEAR ---
    {
      id: 8,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>NEAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearFrontStanding.gif',
      record: true,
      time: 4,
      distance: Distance.CLOSE,
      position: Position.FRONT,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    {
      id: 9,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>NEAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearHeadTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.CLOSE,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: true,

    },
    {
      id: 10,
      title: 'Recording <strong>WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['<strong>No fast movements</strong>', 'Camera distance: <strong>NEAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>STANDING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearTiltedStanding.gif',
      record: true,
      time: 4,
      distance: Distance.CLOSE,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.STANDING,
      headphones: true,
    },
    // **** TALKING ****
    {
      id: 1,
      title: 'Recording <strong>TALKING</strong>',
      subtitle: 'Talking like on a video call but without doing any type of hand expressions',
      text: ['Camera distances: FAR, MEDIUM, NEAR', 'Positions: FRONT, HEAD TILTED and TILTED', 'Behaviour: <strong>TALKING</strong> ', 'Don’t worry, we are going to guide you through the process step by step.'],
      imageText: '',
      image: '',
      record: false
    },
    // WITHOUT HEADPHONES
    // --- FAR ---
    {
      id: 2,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farFrontTalking.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.FRONT,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    {
      id: 4,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farHeadTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    {
      id: 4,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    // --- MEDIUM ---
    {
      id: 5,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumFrontTalking.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.FRONT,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    {
      id: 6,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumHeadTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    {
      id: 7,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    // --- NEAR ---
    {
      id: 8,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearFrontTalking.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.FRONT,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    {
      id: 9,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearHeadTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    {
      id: 10,
      title: 'Recording <strong>TALKING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: false,
    },
    // WITH HEADPHONES
    // --- FAR ---
    {
      id: 2,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farFrontTalking.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.FRONT,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    {
      id: 4,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farHeadTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    {
      id: 4,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    // --- MEDIUM ---
    {
      id: 5,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumFrontTalking.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.FRONT,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    {
      id: 6,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumHeadTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    {
      id: 7,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    // --- NEAR ---
    {
      id: 8,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearFrontTalking.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.FRONT,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    {
      id: 9,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearHeadTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    {
      id: 10,
      title: 'Recording <strong>TALKING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>TALKING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearTiltedTalking.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.TALKING,
      headphones: true,
    },
    // **** GESTURING ****
    {
      id: 1,
      title: 'Recording <strong>GESTURING</strong>',
      subtitle: 'Talking like on a video call and moving hands doing usual gestures. <br><br> Explaining, pointing, greeting, thinking pose, scratching face, raising hand…',
      text: ['Camera distances: FAR, MEDIUM, NEAR', 'Positions: FRONT, HEAD TILTED and TILTED', 'Behaviour: <strong>GESTURING</strong>', 'Don’t worry, we are going to guide you through the process step by step.'],
      imageText: '',
      image: '',
      record: false
    },
    // WITHOUT HEADPHONES
    // --- FAR ---
    {
      id: 2,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farFrontGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.FRONT,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    {
      id: 4,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farHeadTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    {
      id: 4,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/farTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    // --- MEDIUM ---
    {
      id: 5,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumFrontGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.FRONT,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    {
      id: 6,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumHeadTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    {
      id: 7,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/mediumTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    // --- NEAR ---
    {
      id: 8,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearFrontGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.FRONT,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    {
      id: 9,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearHeadTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    {
      id: 10,
      title: 'Recording <strong>GESTURING WITHOUT HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withoutheadphones/nearTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: false,
    },
    // WITH HEADPHONES
    // --- FAR ---
    {
      id: 2,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farFrontGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.FRONT,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    {
      id: 4,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farHeadTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    {
      id: 4,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>FAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/farTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.FAR,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    // --- MEDIUM ---
    {
      id: 5,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumFrontGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.FRONT,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    {
      id: 6,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumHeadTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    {
      id: 7,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>MEDIUM</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/mediumTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.MEDIUM,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    // --- NEAR ---
    {
      id: 8,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>FRONT</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearFrontGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.FRONT,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    {
      id: 9,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>HEAD TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearHeadTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.HEAD_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },
    {
      id: 10,
      title: 'Recording <strong>GESTURING WITH HEADPHONES</strong>',
      subtitle: 'Please recording the following situation:',
      text: ['Camera distance: <strong>NEAR</strong>', 'Position: <strong>TILTED</strong>', 'Behaviour: <strong>GESTURING</strong>'],
      imageText: 'Your video should look like the following one:',
      image: 'assets/images/withheadphones/nearTiltedGesturing.gif',
      record: true,
      time: 11,
      distance: Distance.CLOSE,
      position: Position.BODY_TILTED,
      behaviour: Behaviour.GESTURING,
      headphones: true,
    },

  ];
  @ViewChild('videoElement') elementRef: ElementRef;
  @ViewChild('preview') previewElementRef: ElementRef;


  constructor(private router: Router, private dataSrv: DataService) {
    this.caseToShow = this.recordingCases[this.index];
  }

  ngAfterViewInit() {
    this.OV = new OpenVidu();
    this.publisher = this.OV.initPublisher(undefined, {
      audioSource: false, // The source of audio. If undefined default microphone
      videoSource: undefined, // The source of video. If undefined default webcam
      publishAudio: false,     // Whether you want to start publishing with your audio unmuted or not
      publishVideo: true,     // Whether you want to start publishing with your video enabled or not
      resolution: '640x480',  // The resolution of your video
      frameRate: 30,          // The frame rate of your video
      insertMode: 'APPEND',   // How the video is inserted in the target element 'video-container'
      mirror: false           // Whether to mirror your local video or not
    });
    this.localRecorder = this.OV.initLocalRecorder(this.publisher.stream);


    if (!!this.elementRef) {
      this.publisher.addVideoElement(this.elementRef.nativeElement);
    }
  }

  ngOnInit() { }
  ngOnDestroy() {

    if (this.publisher){
      this.publisher.stream.disposeWebRtcPeer();
      this.publisher.stream.disposeMediaStream();
    }
  }

  async startRecording() {
    if (this.localRecorder.state === LocalRecorderState.FINISHED){
      this.videoPreview?.remove();
      this.localRecorder?.clean();
      this.canContinue = false;
    }

    if (this.caseToShow.record && this.localRecorder.state === LocalRecorderState.READY){

      try {

        const interval = setInterval(() => {
          this.recordingProgress += (1.05 / this.caseToShow.time);
        }, 10);
        await this.localRecorder.record();



        setTimeout(async () => {
          clearInterval(interval);
          this.recordingProgress = 100;
          await this.localRecorder.stop();
          this.videoPreview = this.localRecorder.preview(this.previewElementRef.nativeElement);
          this.videoPreview.controls = true;
          this.videoPreview.style.maxWidth = '50%';
          this.recordingProgress = 0;
          this.canContinue = true;
        }, this.caseToShow.time * 1000);
      } catch (error) {
        console.error(error);
      }
    }
  }

  async showNextRecordingCase(sendVideo: boolean){
    if (sendVideo) {
      const data = {
        skin: this.dataSrv.getSkin(),
        hair: this.dataSrv.getHair(),
        gender: this.dataSrv.getGender(),
        email: !this.emailSent ? this.dataSrv.getEmail() : '', // Send email only once
        headphones: this.caseToShow?.headphones ? 'with_headphones' : 'without_headphones',
        distance: this.caseToShow.distance,
        position: this.caseToShow.position,
        behaviour: this.caseToShow.behaviour
      };

      try {
        const headers = {
          'Content-Type': 'application/octet-stream',
          Data: JSON.stringify(data)
        };
        this.emailSent = true;
        await this.localRecorder.uploadAsBinary('/recording', headers);

      } catch (error) {
        console.error('ERROR sending the video to backend ', error);
      }
      this.videoPreview?.remove();
      this.localRecorder?.clean();
    }

    this.index += 1;
    if (this.index > this.recordingCases.length - 1){
      return this.router.navigate(['end']);
    }

    this.caseToShow = this.recordingCases[this.index];
    this.canContinue = false;
  }

  stopRecording() {
    this.localRecorder.stop().then(() => {
      this.localRecorder.download();
    });
  }



}
